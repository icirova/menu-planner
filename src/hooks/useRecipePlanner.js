import { useCallback, useEffect, useMemo, useState } from "react";
import { DAYS } from "../constants/days.js";
import { PLANNED_MEAL_KEYS } from "../constants/mealKeys.js";
import { getSlotRecipeIds, slotHasRecipes } from "../utils/mealSlots.js";
import { MEAL_LABELS, TAG_TO_SLOT_KEY } from "./plannerConstants.js";
import { usePlannerFocus } from "./usePlannerFocus.js";
import { usePlannerPointerDrag } from "./usePlannerPointerDrag.js";

export const useRecipePlanner = ({
  recipeList,
  weeklyMenu,
  menuDispatch,
  selectedTags,
}) => {
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [duplicateSource, setDuplicateSource] = useState(null);
  const [planMessage, setPlanMessage] = useState(null);
  const [duplicateMessage, setDuplicateMessage] = useState(null);
  const { focusPlannerCell, plannerCellRefs, plannerRef } = usePlannerFocus();

  const recipesById = useMemo(
    () => new Map(recipeList.map((recipe) => [recipe.id, recipe])),
    [recipeList],
  );
  const targetDay = selectedTarget?.dayIndex ?? null;
  const targetSlot = selectedTarget?.slotKey ?? null;
  const selectedRecipe =
    typeof selectedRecipeId === "number" ? recipesById.get(selectedRecipeId) ?? null : null;

  useEffect(() => {
    if (!selectedRecipeId && !selectedTarget && !duplicateSource) return undefined;

    const handlePointerDown = (event) => {
      if (plannerRef.current?.contains(event.target)) return;
      if (
        event.target instanceof Element &&
        (
          event.target.closest(".recipes__filters .button") ||
          event.target.closest(".recipe__link-button") ||
          event.target.closest(".recipe__detail-link")
        )
      ) {
        return;
      }

      if (duplicateSource) {
        setDuplicateSource(null);
        setPlanMessage("Duplikování slotu bylo zrušeno.");
      } else if (selectedRecipeId) {
        setSelectedRecipeId(null);
        setSelectedTarget(null);
        setPlanMessage("Vybraný recept pro plánování byl zrušen.");
      } else {
        setSelectedTarget(null);
        setPlanMessage("Aktivní cíl plánování byl zrušen.");
      }
      setDuplicateMessage(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [duplicateSource, selectedRecipeId, selectedTarget]);

  const getSuggestedTarget = () => {
    const preferredSlotKey = selectedTags.length === 1 ? TAG_TO_SLOT_KEY[selectedTags[0]] : null;
    const firstEmptyPreferredSlot = preferredSlotKey
      ? weeklyMenu.week.findIndex((day) => !slotHasRecipes(day[preferredSlotKey]))
      : -1;
    const firstEmptySlot =
      weeklyMenu.week.flatMap((day, dayIndex) =>
        PLANNED_MEAL_KEYS.map(({ key }) => ({ dayIndex, key, value: day[key] })),
      ).find((slot) => !slotHasRecipes(slot.value)) ?? { dayIndex: 0, key: PLANNED_MEAL_KEYS[0].key };

    if (preferredSlotKey) {
      return {
        dayIndex: firstEmptyPreferredSlot >= 0 ? firstEmptyPreferredSlot : 0,
        slotKey: preferredSlotKey,
      };
    }

    return {
      dayIndex: firstEmptySlot.dayIndex,
      slotKey: firstEmptySlot.key,
    };
  };

  const assignRecipeToSlot = (recipe, dayIndex, slotKey) => {
    const existingRecipeIds = getSlotRecipeIds(weeklyMenu.week[dayIndex]?.[slotKey]);
    const existingRecipes = existingRecipeIds
      .map((recipeId) => recipesById.get(recipeId))
      .filter(Boolean);

    if (existingRecipeIds.includes(recipe.id)) {
      setPlanMessage(`Recept „${recipe.title}“ už ve slotu ${DAYS[dayIndex]} – ${MEAL_LABELS[slotKey] ?? slotKey} je.`);
      setDuplicateMessage(null);
      return false;
    }

    menuDispatch({
      type: "UPDATE_MEAL",
      dayIndex,
      mealKey: slotKey,
      value: recipe.id,
      append: true,
    });

    const slotLabel = MEAL_LABELS[slotKey] ?? slotKey;
    const dayLabel = DAYS[dayIndex];
    setDuplicateMessage(
      existingRecipes.length
        ? `Do slotu ${dayLabel} – ${slotLabel} byl přidán další recept.`
        : null,
    );
    setPlanMessage(
      existingRecipes.length
        ? `Recept „${recipe.title}“ byl přidán do slotu ${dayLabel} – ${slotLabel}.`
        : `Recept „${recipe.title}“ byl přiřazen do slotu ${dayLabel} – ${slotLabel}.`,
    );
    setSelectedRecipeId(null);
    setSelectedTarget(null);
    focusPlannerCell(dayIndex, slotKey);

    return true;
  };

  const startPlanning = (recipeId) => {
    const recipe = recipesById.get(recipeId);
    if (!recipe) return;
    const isAlreadySelected = selectedRecipeId === recipeId;

    if (isAlreadySelected) {
      setSelectedRecipeId(null);
      setSelectedTarget(null);
      setDuplicateMessage(null);
      setPlanMessage(`Výběr receptu „${recipe.title}“ byl zrušen.`);
      return;
    }

    if (selectedTarget) {
      setDuplicateMessage(null);
      assignRecipeToSlot(recipe, selectedTarget.dayIndex, selectedTarget.slotKey);
      return;
    }

    const suggestedTarget = getSuggestedTarget();

    setSelectedRecipeId(recipeId);
    setSelectedTarget(suggestedTarget);
    setDuplicateMessage(null);
    setPlanMessage(
      `Vybraný recept „${recipe.title}“. Klikni na slot v tabulce pro přidání nebo nejdřív klikni na slot a potom na recept.`,
    );
  };

  const handlePlannerCellClick = (dayIndex, slotKey) => {
    if (suppressPlannerClickRef.current) {
      suppressPlannerClickRef.current = false;
      return;
    }

    if (duplicateSource) {
      if (duplicateSource.dayIndex === dayIndex && duplicateSource.slotKey === slotKey) {
        setDuplicateSource(null);
        setPlanMessage("Duplikování slotu bylo zrušeno.");
        setDuplicateMessage(null);
        return;
      }

      const targetRecipeIds = getSlotRecipeIds(weeklyMenu.week[dayIndex]?.[slotKey]);
      if (targetRecipeIds.length > 0) {
        setPlanMessage("Duplikát můžeš vložit jen do prázdného slotu.");
        setDuplicateMessage(null);
        return;
      }

      menuDispatch({
        type: "UPDATE_MEAL",
        dayIndex,
        mealKey: slotKey,
        value: duplicateSource.recipeIds,
      });

      setDuplicateSource(null);
      setSelectedRecipeId(null);
      setSelectedTarget(null);
      setDuplicateMessage(null);
      setPlanMessage(`Do slotu ${DAYS[dayIndex]} – ${MEAL_LABELS[slotKey] ?? slotKey} byl zkopírován obsah jiného slotu.`);
      focusPlannerCell(dayIndex, slotKey);
      return;
    }

    if (selectedRecipe) {
      assignRecipeToSlot(selectedRecipe, dayIndex, slotKey);
      return;
    }

    if (selectedTarget?.dayIndex === dayIndex && selectedTarget?.slotKey === slotKey) {
      setSelectedTarget(null);
      setPlanMessage("Aktivní cíl plánování byl zrušen.");
      setDuplicateMessage(null);
      return;
    }

    setSelectedTarget({ dayIndex, slotKey });
    setPlanMessage(`Vybraný cíl pro další vložení: ${DAYS[dayIndex]} – ${MEAL_LABELS[slotKey] ?? slotKey}.`);
    setDuplicateMessage(null);
  };

  const commitDraggedPayload = useCallback((payload, toDayIndex, toSlotKey) => {
    if (
      !payload ||
      typeof payload.dayIndex !== "number" ||
      typeof payload.slotKey !== "string"
    ) {
      return false;
    }

    if (payload.dayIndex === toDayIndex && payload.slotKey === toSlotKey) {
      return false;
    }

    menuDispatch({
      type: "MOVE_MEAL",
      fromDay: payload.dayIndex,
      fromKey: payload.slotKey,
      toDay: toDayIndex,
      toKey: toSlotKey,
      recipeId: payload.recipeId,
      moveAll: payload.moveAll === true,
    });

    setDuplicateMessage(null);
    setSelectedTarget(null);
    focusPlannerCell(toDayIndex, toSlotKey);
    return true;
  }, [focusPlannerCell, menuDispatch]);

  const {
    handlePlannerPointerDown,
    pointerDrag,
    suppressPlannerClickRef,
  } = usePlannerPointerDrag({ commitDraggedPayload });

  const clearPlannerCell = (dayIndex, slotKey, recipeId = null) => {
    const slotLabel = MEAL_LABELS[slotKey] ?? slotKey;
    const dayLabel = DAYS[dayIndex];

    menuDispatch({
      type: "CLEAR_MEAL",
      dayIndex,
      mealKey: slotKey,
      recipeId: typeof recipeId === "number" ? recipeId : undefined,
    });

    setPlanMessage(
      typeof recipeId === "number"
        ? `Jedna položka ze slotu ${dayLabel} – ${slotLabel} byla odebrána.`
        : `Slot ${dayLabel} – ${slotLabel} byl vymazán.`,
    );
    setDuplicateMessage(null);
    setSelectedTarget({ dayIndex, slotKey });
    focusPlannerCell(dayIndex, slotKey);
  };

  const clearWholePlan = () => {
    menuDispatch({ type: "CLEAR_WEEK" });
    setSelectedRecipeId(null);
    setSelectedTarget(null);
    setDuplicateSource(null);
    setDuplicateMessage(null);
    setPlanMessage("Celý týdenní plán byl vymazán.");
  };

  const handleDuplicateSlotStart = (dayIndex, slotKey) => {
    const recipeIds = getSlotRecipeIds(weeklyMenu.week[dayIndex]?.[slotKey]);
    if (!recipeIds.length) return;

    if (duplicateSource?.dayIndex === dayIndex && duplicateSource?.slotKey === slotKey) {
      setDuplicateSource(null);
      setPlanMessage("Duplikování slotu bylo zrušeno.");
      setDuplicateMessage(null);
      return;
    }

    setDuplicateSource({ dayIndex, slotKey, recipeIds });
    setSelectedRecipeId(null);
    setSelectedTarget(null);
    setDuplicateMessage(null);
    setPlanMessage(`Vybrán zdroj pro duplikování: ${DAYS[dayIndex]} – ${MEAL_LABELS[slotKey] ?? slotKey}. Klikni na prázdný slot pro vložení kopie.`);
  };

  return {
    duplicateMessage,
    duplicateSource,
    planMessage,
    plannerCellRefs,
    plannerRef,
    pointerDrag,
    recipesById,
    selectedRecipeId,
    targetDay,
    targetSlot,
    clearPlannerCell,
    clearWholePlan,
    handleDuplicateSlotStart,
    handlePlannerPointerDown,
    handlePlannerCellClick,
    startPlanning,
  };
};
