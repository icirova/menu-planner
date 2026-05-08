import { useCallback, useEffect, useMemo, useReducer } from "react";
import {
  getOutsideCancelActionType,
  getSlotRecipeIdsForPlanner,
  getSuggestedPlannerTarget,
  initialPlannerUiState,
  plannerUiReducer,
} from "../reducers/plannerUiReducer.js";
import { usePlannerFocus } from "./usePlannerFocus.js";
import { usePlannerPointerDrag } from "./usePlannerPointerDrag.js";

export const useRecipePlanner = ({ recipeList, weeklyMenu, menuDispatch, selectedTags }) => {
  const [plannerUiState, plannerUiDispatch] = useReducer(plannerUiReducer, initialPlannerUiState);
  const { duplicateMessage, duplicateSource, planMessage, selectedRecipeId, selectedTarget } =
    plannerUiState;
  const { focusPlannerCell, plannerCellRefs, plannerRef } = usePlannerFocus();

  const recipesById = useMemo(
    () => new Map(recipeList.map((recipe) => [recipe.id, recipe])),
    [recipeList],
  );
  const targetDay = selectedTarget?.dayIndex ?? null;
  const targetSlot = selectedTarget?.slotKey ?? null;
  const selectedRecipe =
    typeof selectedRecipeId === "number" ? (recipesById.get(selectedRecipeId) ?? null) : null;

  useEffect(() => {
    if (!selectedRecipeId && !selectedTarget && !duplicateSource) return undefined;

    const handlePointerDown = (event) => {
      if (plannerRef.current?.contains(event.target)) return;
      if (
        event.target instanceof Element &&
        (event.target.closest(".recipes__filters .button") ||
          event.target.closest(".recipe__link-button") ||
          event.target.closest(".recipe__detail-link"))
      ) {
        return;
      }

      const cancelActionType = getOutsideCancelActionType(plannerUiState);
      if (cancelActionType) {
        plannerUiDispatch({ type: cancelActionType });
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [duplicateSource, plannerRef, plannerUiState, selectedRecipeId, selectedTarget]);

  const assignRecipeToSlot = (recipe, dayIndex, slotKey) => {
    const existingRecipeIds = getSlotRecipeIdsForPlanner(weeklyMenu.week, dayIndex, slotKey);
    const existingRecipes = existingRecipeIds
      .map((recipeId) => recipesById.get(recipeId))
      .filter(Boolean);

    if (existingRecipeIds.includes(recipe.id)) {
      plannerUiDispatch({
        type: "ASSIGN_DUPLICATE_RECIPE",
        dayIndex,
        recipeTitle: recipe.title,
        slotKey,
      });
      return false;
    }

    menuDispatch({
      type: "UPDATE_MEAL",
      dayIndex,
      mealKey: slotKey,
      value: recipe.id,
      append: true,
    });

    plannerUiDispatch({
      type: "ASSIGN_RECIPE",
      dayIndex,
      hadExistingRecipes: existingRecipes.length > 0,
      recipeTitle: recipe.title,
      slotKey,
    });
    focusPlannerCell(dayIndex, slotKey);

    return true;
  };

  const startPlanning = (recipeId) => {
    const recipe = recipesById.get(recipeId);
    if (!recipe) return;
    const isAlreadySelected = selectedRecipeId === recipeId;

    if (isAlreadySelected) {
      plannerUiDispatch({ type: "CANCEL_SELECTED_RECIPE", recipeTitle: recipe.title });
      return;
    }

    if (selectedTarget) {
      assignRecipeToSlot(recipe, selectedTarget.dayIndex, selectedTarget.slotKey);
      return;
    }

    plannerUiDispatch({
      type: "SELECT_RECIPE",
      recipeId,
      recipeTitle: recipe.title,
      suggestedTarget: getSuggestedPlannerTarget(weeklyMenu.week, selectedTags),
    });
  };

  const handlePlannerCellClick = (dayIndex, slotKey) => {
    if (suppressPlannerClickRef.current) {
      suppressPlannerClickRef.current = false;
      return;
    }

    if (duplicateSource) {
      if (duplicateSource.dayIndex === dayIndex && duplicateSource.slotKey === slotKey) {
        plannerUiDispatch({ type: "CANCEL_DUPLICATE" });
        return;
      }

      const targetRecipeIds = getSlotRecipeIdsForPlanner(weeklyMenu.week, dayIndex, slotKey);
      if (targetRecipeIds.length > 0) {
        plannerUiDispatch({ type: "REJECT_DUPLICATE_TARGET" });
        return;
      }

      menuDispatch({
        type: "UPDATE_MEAL",
        dayIndex,
        mealKey: slotKey,
        value: duplicateSource.recipeIds,
      });

      plannerUiDispatch({ type: "COMMIT_DUPLICATE_SLOT", dayIndex, slotKey });
      focusPlannerCell(dayIndex, slotKey);
      return;
    }

    if (selectedRecipe) {
      assignRecipeToSlot(selectedRecipe, dayIndex, slotKey);
      return;
    }

    if (selectedTarget?.dayIndex === dayIndex && selectedTarget?.slotKey === slotKey) {
      plannerUiDispatch({ type: "CANCEL_SELECTED_TARGET" });
      return;
    }

    plannerUiDispatch({ type: "SELECT_TARGET", dayIndex, slotKey });
  };

  const commitDraggedPayload = useCallback(
    (payload, toDayIndex, toSlotKey) => {
      if (!payload || typeof payload.dayIndex !== "number" || typeof payload.slotKey !== "string") {
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

      plannerUiDispatch({ type: "COMMIT_DRAG" });
      focusPlannerCell(toDayIndex, toSlotKey);
      return true;
    },
    [focusPlannerCell, menuDispatch],
  );

  const { handlePlannerPointerDown, pointerDrag, suppressPlannerClickRef } = usePlannerPointerDrag({
    commitDraggedPayload,
  });

  const clearPlannerCell = (dayIndex, slotKey, recipeId = null) => {
    menuDispatch({
      type: "CLEAR_MEAL",
      dayIndex,
      mealKey: slotKey,
      recipeId: typeof recipeId === "number" ? recipeId : undefined,
    });

    plannerUiDispatch({ type: "CLEAR_CELL", dayIndex, recipeId, slotKey });
    focusPlannerCell(dayIndex, slotKey);
  };

  const clearWholePlan = () => {
    menuDispatch({ type: "CLEAR_WEEK" });
    plannerUiDispatch({ type: "CLEAR_WEEK" });
  };

  const handleDuplicateSlotStart = (dayIndex, slotKey) => {
    const recipeIds = getSlotRecipeIdsForPlanner(weeklyMenu.week, dayIndex, slotKey);
    if (!recipeIds.length) return;

    if (duplicateSource?.dayIndex === dayIndex && duplicateSource?.slotKey === slotKey) {
      plannerUiDispatch({ type: "CANCEL_DUPLICATE" });
      return;
    }

    plannerUiDispatch({ type: "START_DUPLICATE_SLOT", dayIndex, recipeIds, slotKey });
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
