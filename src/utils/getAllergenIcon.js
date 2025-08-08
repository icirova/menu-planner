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
    "arašídy": "🥜",
    "peanuts": "🥜",
    "soy": "🌱",
    "sója": "🌱",
    "fish": "🐟",
    "ryby": "🐟"
  };

  return map[allergen.toLowerCase()] || "⚠️";
};

