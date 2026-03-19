const normalizeMetadataKey = (value) =>
  String(value ?? "").trim().toLowerCase();

const createMetadataIndex = (definitions) =>
  definitions.reduce((index, definition) => {
    const entries = [definition.value, ...(definition.aliases ?? [])];

    entries.forEach((entry) => {
      index[normalizeMetadataKey(entry)] = definition;
    });

    return index;
  }, {});

export const TAG_DEFINITIONS = [
  { label: "Snídaně", value: "snídaně", icon: "🍳", aliases: ["snidane", "breakfast"] },
  { label: "Svačiny", value: "svačiny", icon: "🥪", aliases: ["svačina", "svacina", "snack"] },
  { label: "Polévky", value: "polévky", icon: "🥣", aliases: ["polévka", "polevky", "soup"] },
  { label: "Obědy", value: "obědy", icon: "🍲", aliases: ["oběd", "obed", "lunch"] },
  { label: "Večeře", value: "večeře", icon: "🍽️", aliases: ["vecere", "dinner"] },
  { label: "Moučníky", value: "moučníky", icon: "🍰", aliases: ["moučník", "moucniky", "dessert"] },
];

const TAG_INDEX = createMetadataIndex(TAG_DEFINITIONS);

export const normalizeTagValue = (value) =>
  TAG_INDEX[normalizeMetadataKey(value)]?.value ?? normalizeMetadataKey(value);

export const getTagMetadata = (value) =>
  TAG_INDEX[normalizeMetadataKey(value)] ?? null;

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
  "veganské": ["bez mléka"],
};

export const getRecipeSuitableForFilterValues = (suitability = []) => {
  const values = new Set(suitability);

  suitability.forEach((value) => {
    (SUITABILITY_IMPLICATIONS[value] ?? []).forEach((derivedValue) => {
      values.add(derivedValue);
    });
  });

  return [...values];
};

export const ALLERGEN_DEFINITIONS = [
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

const ALLERGEN_INDEX = createMetadataIndex(ALLERGEN_DEFINITIONS);

export const getAllergenMetadata = (value) =>
  ALLERGEN_INDEX[normalizeMetadataKey(value)] ?? null;

export const ALLERGEN_OPTIONS = ALLERGEN_DEFINITIONS.map(({ label, value }) => ({
  label,
  value,
}));
