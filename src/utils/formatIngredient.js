import { formatIngredientNameForAmount } from "./ingredientNames";

export const formatIngredient = (ingredient, baseServings, newServings) => {
  const safeBaseServings = Number(baseServings);
  const safeNewServings = Number(newServings);
  const amount = Number(ingredient.amount);
  const itemName = formatIngredientNameForAmount(ingredient.item, ingredient.unit);

  if (!Number.isFinite(safeBaseServings) || safeBaseServings <= 0) {
    return `${ingredient.amount} ${ingredient.unit} ${itemName}`.trim();
  }

  const factor = safeNewServings / safeBaseServings;

  if (!Number.isFinite(factor) || !Number.isFinite(amount)) {
    return `${ingredient.amount} ${ingredient.unit} ${itemName}`.trim();
  }

  const scaledAmount = amount * factor;
  const newAmount = Number.isInteger(scaledAmount)
    ? String(scaledAmount)
    : scaledAmount.toFixed(1);

  return `${newAmount} ${ingredient.unit} ${itemName}`.trim();
};


  
