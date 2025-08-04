export const getAllergenIcon = (allergen) => {
  const map = {
    "milk": "🥛",
    "mléko": "🥛",
    "eggs": "🥚",
    "vejce": "🥚",
    "gluten": "🌾",
    "lepek": "🌾",
    "nuts": "🥜",
    "ořechy": "🥜",
    "soy": "🌱",
    "sója": "🌱",
    "fish": "🐟",
    "ryby": "🐟"
  };

  return map[allergen.toLowerCase()] || "⚠️";
};

