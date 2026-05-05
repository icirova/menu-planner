import { useEffect, useMemo, useRef, useState } from "react";
import { PLANNED_MEAL_KEYS } from "../constants/mealKeys";
import { getSlotRecipeIds, slotHasRecipes } from "../utils/mealSlots";

export const DAYS = ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"];

const TAG_TO_SLOT_KEY = {
  "snídaně": "breakfast",
  "svačiny": "snack1",
  "obědy": "lunch",
  "večeře": "dinner",
};

export const MEAL_LABELS = {
  breakfast: "Snídaně",
  snack1: "Svačina 1",
  lunch: "Oběd",
  snack2: "Svačina 2",
  dinner: "Večeře",
  extra: "EXTRA",
};

export const useRecipePlanner = ({
  recipeList,
  weeklyMenu,
  menuDispatch,
  selectedTags,
}) => {
  const DRAG_START_DISTANCE = 6;
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [duplicateSource, setDuplicateSource] = useState(null);
  const [planMessage, setPlanMessage] = useState(null);
  const [duplicateMessage, setDuplicateMessage] = useState(null);
  const [pointerDrag, setPointerDrag] = useState(null);
  const plannerCellRefs = useRef(new Map());
  const plannerRef = useRef(null);
  const dragPayloadRef = useRef(null);
  const dragTargetRef = useRef(null);
  const dropHandledRef = useRef(false);
  const pointerDragRef = useRef(null);
  const suppressPlannerClickRef = useRef(false);

  const recipesById = useMemo(
    () => new Map(recipeList.map((recipe) => [recipe.id, recipe])),
    [recipeList],
  );
  const targetDay = selectedTarget?.dayIndex ?? null;
  const targetSlot = selectedTarget?.slotKey ?? null;
  const selectedRecipe =
    typeof selectedRecipeId === "number" ? recipesById.get(selectedRecipeId) ?? null : null;

  const clearPointerDrag = () => {
    pointerDragRef.current = null;
    setPointerDrag(null);
  };

  const resolvePlannerCellFromPoint = (clientX, clientY) => {
    if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) return null;

    const target = document.elementFromPoint(clientX, clientY);
    if (!(target instanceof Element)) return null;

    const plannerCell = target.closest("[data-planner-cell='true']");
    if (!(plannerCell instanceof HTMLElement)) return null;

    const dayIndex = Number(plannerCell.dataset.dayIndex);
    const slotKey = plannerCell.dataset.slotKey;

    if (!Number.isFinite(dayIndex) || typeof slotKey !== "string" || !slotKey) {
      return null;
    }

    return { dayIndex, slotKey };
  };

  useEffect(() => {
    if (!selectedRecipeId && !selectedTarget && !duplicateSource) return undefined;

    const handlePointerDown = (event) => {
      if (plannerRef.current?.contains(event.target)) return;
      if (
        event.target instanceof Element &&
        (
          event.target.closest(".recipes__filters .button") ||
          event.target.closest(".recipe__linkButton") ||
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

  const focusPlannerCell = (dayIndex, slotKey) => {
    window.requestAnimationFrame(() => {
      const refKey = `${dayIndex}-${slotKey}`;
      plannerCellRefs.current.get(refKey)?.focus();
    });
  };

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

  const commitDraggedPayload = (payload, toDayIndex, toSlotKey) => {
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
    dragPayloadRef.current = null;
    dragTargetRef.current = null;
    focusPlannerCell(toDayIndex, toSlotKey);
    return true;
  };

  const handlePlannerPointerDown = (event, dayIndex, slotKey, options = {}) => {
    if (event.button !== 0) return;

    const { recipeId, moveAll = false, label = "" } = options;
    if (!moveAll && typeof recipeId !== "number") return;

    const payload = { dayIndex, slotKey, recipeId, moveAll };
    const nextDrag = {
      payload,
      label,
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
      isActive: false,
      target: null,
    };

    pointerDragRef.current = nextDrag;
    setPointerDrag(nextDrag);
  };

  useEffect(() => {
    if (!pointerDrag) return undefined;

    const handlePointerMove = (event) => {
      const current = pointerDragRef.current;
      if (!current) return;

      const distance = Math.hypot(event.clientX - current.startX, event.clientY - current.startY);
      const isActive = current.isActive || distance >= DRAG_START_DISTANCE;
      const target = isActive ? resolvePlannerCellFromPoint(event.clientX, event.clientY) : null;

      const nextDrag = {
        ...current,
        x: event.clientX,
        y: event.clientY,
        isActive,
        target,
      };

      pointerDragRef.current = nextDrag;
      setPointerDrag(nextDrag);

      if (isActive) {
        event.preventDefault();
      }
    };

    const handlePointerUp = (event) => {
      const current = pointerDragRef.current;
      if (!current) return;

      const target = resolvePlannerCellFromPoint(event.clientX, event.clientY) ?? current.target;
      const didMove = Boolean(current.isActive && target);

      if (didMove) {
        commitDraggedPayload(current.payload, target.dayIndex, target.slotKey);
        suppressPlannerClickRef.current = true;
      }

      clearPointerDrag();
    };

    const handlePointerCancel = () => {
      clearPointerDrag();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, [pointerDrag]);

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
