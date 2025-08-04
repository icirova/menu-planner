export const formatIngredient = (ingredient, baseServings, newServings) => {
    const factor = newServings / baseServings;
    const newAmount = (ingredient.amount * factor).toFixed(1);
    return `${newAmount} ${ingredient.unit} ${ingredient.item}`.trim();
  };


  