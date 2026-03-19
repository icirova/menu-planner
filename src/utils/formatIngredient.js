export const formatIngredient = (ingredient, baseServings, newServings) => {
  const safeBaseServings = Number(baseServings);
  const safeNewServings = Number(newServings);
  const amount = Number(ingredient.amount);

  if (!Number.isFinite(safeBaseServings) || safeBaseServings <= 0) {
    return `${ingredient.amount} ${ingredient.unit} ${ingredient.item}`.trim();
  }

  const factor = safeNewServings / safeBaseServings;

  if (!Number.isFinite(factor) || !Number.isFinite(amount)) {
    return `${ingredient.amount} ${ingredient.unit} ${ingredient.item}`.trim();
  }

  const scaledAmount = amount * factor;
  const newAmount = Number.isInteger(scaledAmount)
    ? String(scaledAmount)
    : scaledAmount.toFixed(1);

  return `${newAmount} ${ingredient.unit} ${ingredient.item}`.trim();
};


  
