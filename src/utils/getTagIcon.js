export const getTagIcon = (label) => {
  const map = {
    "snídaně": "🍳",
    "snidane": "🍳",
    "breakfast": "🍳",

    "svačina": "🥪",
    "svacina": "🥪",
    "snack": "🥪",

    "polévky": "🥣",
    "polevky": "🥣",
    "soup": "🥣",

    "oběd": "🍲",
    "obed": "🍲",
    "lunch": "🍲",

    "večeře": "🍽️",
    "vecere": "🍽️",
    "dinner": "🍽️",

    "moučníky": "🍰",
    "moucniky": "🍰",
    "dessert": "🍰"
  };

  return map[label.toLowerCase()] || "🏷️";
};
