export const getSuitabilityIcon = (label) => {
  const map = {
    "vegetariánské": "🌱",
    "vegetarian": "🌱",

    "veganské": "🥦",
    "vegan": "🥦",

    "bez lepku": "🚫🌾",
    "gluten-free": "🚫🌾",

    "bez mléka": "🚫🥛",
    "dairy-free": "🚫🥛",

    "low-carb": "⬇️🍞",
    "nízkosacharidové": "⬇️🍞",

    "high-protein": "💪",
    "vysoký obsah bílkovin": "💪",

    "bez cukru": "🚫🍬",
    "sugar-free": "🚫🍬"
  };

  return map[label.toLowerCase()] || "✔️";
};