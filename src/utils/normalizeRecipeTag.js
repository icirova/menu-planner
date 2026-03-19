const TAG_ALIASES = {
  "snídaně": "snídaně",
  "svačina": "svačiny",
  "svačiny": "svačiny",
  "polévka": "polévky",
  "polévky": "polévky",
  "oběd": "obědy",
  "obědy": "obědy",
  "večeře": "večeře",
  "moučník": "moučníky",
  "moučníky": "moučníky",
};

export const normalizeRecipeTag = (tag) => {
  const normalizedTag = String(tag ?? "").trim().toLowerCase();
  return TAG_ALIASES[normalizedTag] ?? normalizedTag;
};

export const normalizeRecipeTags = (tags = []) =>
  tags.map(normalizeRecipeTag);
