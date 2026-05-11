const normalizeMetadataKey = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const createMetadataIndex = (definitions) =>
  definitions.reduce((index, definition) => {
    const entries = [definition.value, ...(definition.aliases ?? [])];

    entries.forEach((entry) => {
      index[normalizeMetadataKey(entry)] = definition;
    });

    return index;
  }, {});

const TAG_DEFINITIONS = [
  { label: "Snídaně", value: "snídaně", icon: "🍳", aliases: ["snidane", "breakfast"] },
  { label: "Svačiny", value: "svačiny", icon: "🥪", aliases: ["svačina", "svacina", "snack"] },
  { label: "Obědy", value: "obědy", icon: "🍲", aliases: ["oběd", "obed", "lunch"] },
  { label: "Večeře", value: "večeře", icon: "🍽️", aliases: ["vecere", "dinner"] },
  { label: "Moučníky", value: "moučníky", icon: "🍰", aliases: ["moučník", "moucniky", "dessert"] },
  { label: "Polévky", value: "polévky", icon: "🥣", aliases: ["polévka", "polevky", "soup"] },
  {
    label: "Pomazánky",
    value: "pomazánky",
    icon: "🫙",
    aliases: ["pomazanka", "pomazanky", "spread"],
  },
  { label: "Přílohy", value: "přílohy", icon: "🥔", aliases: ["priloha", "prilohy", "side"] },
];

const TAG_INDEX = createMetadataIndex(TAG_DEFINITIONS);

export const normalizeTagValue = (value) =>
  TAG_INDEX[normalizeMetadataKey(value)]?.value ?? normalizeMetadataKey(value);

export const TAG_OPTIONS = TAG_DEFINITIONS.map(({ label, value }) => ({
  label,
  value,
}));

export const SUITABILITY_OPTIONS = [
  { label: "Veganské", value: "veganské" },
  { label: "Bez lepku", value: "bez lepku" },
  { label: "Bez mléka", value: "bez mléka" },
];

const SUITABILITY_IMPLICATIONS = {
  veganské: ["bez mléka"],
};

const SUITABILITY_ALLERGEN_EXCLUSIONS = {
  veganské: ["korýši", "vejce", "ryby", "mléko"],
  "bez lepku": ["lepek"],
  "bez mléka": ["mléko"],
};

export const normalizeSuitableForValues = (suitability = []) => {
  const values = [...suitability];

  if (values.includes("veganské")) {
    return values.filter((value) => value !== "bez mléka");
  }

  return values;
};

export const getRecipeSuitableForFilterValues = (suitability = []) => {
  const values = new Set(normalizeSuitableForValues(suitability));

  values.forEach((value) => {
    (SUITABILITY_IMPLICATIONS[value] ?? []).forEach((derivedValue) => {
      values.add(derivedValue);
    });
  });

  return [...values];
};

export const isSuitabilityOptionDisabled = (optionValue, selectedValues = []) =>
  optionValue === "bez mléka" && normalizeSuitableForValues(selectedValues).includes("veganské");

export const getExcludedAllergensForSuitability = (suitability = []) => {
  const values = new Set(getRecipeSuitableForFilterValues(suitability));
  const excludedAllergens = new Set();

  values.forEach((value) => {
    (SUITABILITY_ALLERGEN_EXCLUSIONS[value] ?? []).forEach((allergen) => {
      excludedAllergens.add(allergen);
    });
  });

  return excludedAllergens;
};

export const normalizeAllergenValuesForSuitability = (allergens = [], suitability = []) => {
  const excludedAllergens = getExcludedAllergensForSuitability(suitability);

  return allergens.filter((allergen) => !excludedAllergens.has(allergen));
};

export const isAllergenOptionDisabled = (optionValue, selectedSuitableFor = []) =>
  getExcludedAllergensForSuitability(selectedSuitableFor).has(optionValue);

const ALLERGEN_DEFINITIONS = [
  { label: "Lepek", value: "lepek", icon: "🌾", aliases: ["gluten"] },
  { label: "Korýši", value: "korýši", icon: "🦐", aliases: ["korysi", "crustaceans"] },
  { label: "Vejce", value: "vejce", icon: "🥚", aliases: ["eggs"] },
  { label: "Ryby", value: "ryby", icon: "🐟", aliases: ["fish"] },
  { label: "Arašídy", value: "arašídy", icon: "🥜", aliases: ["arasidy", "peanuts"] },
  { label: "Sója", value: "sója", icon: "🌱", aliases: ["soya", "soy"] },
  { label: "Mléko", value: "mléko", icon: "🥛", aliases: ["mleko", "milk"] },
  { label: "Ořechy", value: "ořechy", icon: "🥜", aliases: ["orechy", "nuts"] },
  { label: "Celer", value: "celer", icon: "🥬", aliases: ["celery"] },
  { label: "Hořčice", value: "hořčice", icon: "🟡", aliases: ["horcice", "mustard"] },
  { label: "Sezam", value: "sezam", icon: "⚪", aliases: ["sesame"] },
];

export const ALLERGEN_OPTIONS = ALLERGEN_DEFINITIONS.map(({ label, value }) => ({
  label,
  value,
}));
