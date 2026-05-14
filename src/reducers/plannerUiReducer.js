import { DAYS } from "../constants/days.js";
import { PLANNED_MEAL_KEYS } from "../constants/mealKeys.js";
import { getSlotRecipeIds, slotHasRecipes } from "../utils/mealSlots.js";
import { MEAL_LABELS, TAG_TO_SLOT_KEY } from "../hooks/plannerConstants.js";

export const initialPlannerUiState = {
  duplicateMessage: null,
  duplicateSource: null,
  planMessage: null,
  selectedRecipeId: null,
  selectedTarget: null,
};

const getSlotLabel = (slotKey) => MEAL_LABELS[slotKey] ?? slotKey;

const getDaySlotLabel = (dayIndex, slotKey) => `${DAYS[dayIndex]} – ${getSlotLabel(slotKey)}`;

export const getSuggestedPlannerTarget = (week = [], selectedTags = []) => {
  const preferredSlotKey = selectedTags.length === 1 ? TAG_TO_SLOT_KEY[selectedTags[0]] : null;
  const firstEmptyPreferredSlot = preferredSlotKey
    ? week.findIndex((day) => !slotHasRecipes(day?.[preferredSlotKey]))
    : -1;
  const firstEmptySlot = week
    .flatMap((day, dayIndex) =>
      PLANNED_MEAL_KEYS.map(({ key }) => ({ dayIndex, key, value: day?.[key] })),
    )
    .find((slot) => !slotHasRecipes(slot.value)) ?? { dayIndex: 0, key: PLANNED_MEAL_KEYS[0].key };

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

export const getOutsideCancelActionType = (state) => {
  if (state.duplicateSource) return "CANCEL_DUPLICATE";
  if (state.selectedRecipeId) return "CANCEL_SELECTED_RECIPE";
  if (state.selectedTarget) return "CANCEL_SELECTED_TARGET";
  return null;
};

export const getSlotRecipeIdsForPlanner = (week, dayIndex, slotKey) =>
  getSlotRecipeIds(week?.[dayIndex]?.[slotKey]);

export const plannerUiReducer = (state, action) => {
  switch (action.type) {
    case "SELECT_RECIPE":
      return {
        ...state,
        duplicateMessage: null,
        duplicateSource: null,
        planMessage: `Vybraný recept „${action.recipeTitle}“. Klikni na slot v tabulce pro přidání nebo nejdřív klikni na slot a potom na recept.`,
        selectedRecipeId: action.recipeId,
        selectedTarget: action.suggestedTarget,
      };

    case "CANCEL_SELECTED_RECIPE":
      return {
        ...state,
        duplicateMessage: null,
        planMessage: action.recipeTitle
          ? `Výběr receptu „${action.recipeTitle}“ byl zrušen.`
          : "Vybraný recept pro plánování byl zrušen.",
        selectedRecipeId: null,
        selectedTarget: null,
      };

    case "SELECT_TARGET":
      return {
        ...state,
        duplicateMessage: null,
        planMessage: `Vybraný cíl pro další vložení: ${getDaySlotLabel(action.dayIndex, action.slotKey)}.`,
        selectedTarget: { dayIndex: action.dayIndex, slotKey: action.slotKey },
      };

    case "CANCEL_SELECTED_TARGET":
      return {
        ...state,
        duplicateMessage: null,
        planMessage: "Aktivní cíl plánování byl zrušen.",
        selectedTarget: null,
      };

    case "ASSIGN_DUPLICATE_RECIPE":
      return {
        ...state,
        duplicateMessage: null,
        planMessage: `Recept „${action.recipeTitle}“ už ve slotu ${getDaySlotLabel(action.dayIndex, action.slotKey)} je.`,
      };

    case "ASSIGN_RECIPE":
      return {
        ...state,
        duplicateMessage: action.hadExistingRecipes
          ? `Do slotu ${getDaySlotLabel(action.dayIndex, action.slotKey)} byl přidán další recept.`
          : null,
        planMessage: action.hadExistingRecipes
          ? `Recept „${action.recipeTitle}“ byl přidán do slotu ${getDaySlotLabel(action.dayIndex, action.slotKey)}.`
          : `Recept „${action.recipeTitle}“ byl přiřazen do slotu ${getDaySlotLabel(action.dayIndex, action.slotKey)}.`,
        selectedRecipeId: null,
        selectedTarget: null,
      };

    case "START_DUPLICATE_SLOT":
      return {
        ...state,
        duplicateMessage: null,
        duplicateSource: {
          dayIndex: action.dayIndex,
          slotKey: action.slotKey,
          recipeIds: action.recipeIds,
        },
        planMessage: `Vybrán zdroj pro duplikování: ${getDaySlotLabel(action.dayIndex, action.slotKey)}. Klikni na prázdný slot pro vložení kopie.`,
        selectedRecipeId: null,
        selectedTarget: null,
      };

    case "CANCEL_DUPLICATE":
      return {
        ...state,
        duplicateMessage: null,
        duplicateSource: null,
        planMessage: "Duplikování slotu bylo zrušeno.",
      };

    case "REJECT_DUPLICATE_TARGET":
      return {
        ...state,
        duplicateMessage: null,
        planMessage: "Duplikát můžeš vložit jen do prázdného slotu.",
      };

    case "COMMIT_DUPLICATE_SLOT":
      return {
        ...state,
        duplicateMessage: null,
        duplicateSource: null,
        planMessage: `Do slotu ${getDaySlotLabel(action.dayIndex, action.slotKey)} byl zkopírován obsah jiného slotu.`,
        selectedRecipeId: null,
        selectedTarget: null,
      };

    case "COMMIT_DRAG":
      return {
        ...state,
        duplicateMessage: null,
        selectedTarget: null,
      };

    case "START_KEYBOARD_DRAG":
      return {
        ...state,
        duplicateMessage: null,
        duplicateSource: null,
        planMessage: `Zvednuto: ${action.label} ze slotu ${getDaySlotLabel(action.dayIndex, action.slotKey)}. Přejdi na cílový slot a stiskni mezerník.`,
        selectedRecipeId: null,
        selectedTarget: null,
      };

    case "CANCEL_KEYBOARD_DRAG":
      return {
        ...state,
        duplicateMessage: null,
        planMessage: "Přesun klávesnicí byl zrušen.",
      };

    case "REJECT_KEYBOARD_DRAG_SOURCE":
      return {
        ...state,
        duplicateMessage: null,
        planMessage: "Slot je prázdný, není co přesouvat.",
      };

    case "COMMIT_KEYBOARD_DRAG":
      return {
        ...state,
        duplicateMessage: null,
        planMessage: `Přesunuto do slotu ${getDaySlotLabel(action.dayIndex, action.slotKey)}.`,
        selectedTarget: null,
      };

    case "CLEAR_CELL":
      return {
        ...state,
        duplicateMessage: null,
        planMessage:
          typeof action.recipeId === "number"
            ? `Jedna položka ze slotu ${getDaySlotLabel(action.dayIndex, action.slotKey)} byla odebrána.`
            : `Slot ${getDaySlotLabel(action.dayIndex, action.slotKey)} byl vymazán.`,
        selectedTarget: { dayIndex: action.dayIndex, slotKey: action.slotKey },
      };

    case "CLEAR_WEEK":
      return {
        ...initialPlannerUiState,
        planMessage: "Celý týdenní plán byl vymazán.",
      };

    default:
      return state;
  }
};
