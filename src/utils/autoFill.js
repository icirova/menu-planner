const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const byAnyTag = (recipe, tags) => recipe.tags?.some(t => tags.includes(t));

/**
 * pickForSlot: vybere recept pro slot podle preferovaných tagů a množiny 'usedIds'
 */
const pickForSlot = (recipes, preferredTags, usedIds) => {
  for (const tag of preferredTags) {
    const pool = recipes.filter(r => byAnyTag(r, [tag]) && !usedIds.has(r.id));
    if (pool.length) {
      const r = shuffle(pool)[0];
      usedIds.add(r.id);
      return r;
    }
  }
  return null;
};

/**
 * autoFillWeekByTags
 * - week: pole dnů (objekt se sloty)
 * - recipes: pole receptů { id, title, tags, ... }
 * - slotTagsMap: { breakfast: [...], ... }
 * - fillOnlyEmpty: true => vyplní jen prázdné sloty; false => přepíše vše
 * - getSlot/setSlot: adaptér podle toho, zda ukládáš do slotu ID nebo TITLE
 */
export const autoFillWeekByTags = ({
  week,
  recipes,
  slotTagsMap,
  fillOnlyEmpty = true,
  getSlot = (day, key) => day[key],                  // čtení hodnoty slotu
  setSlot = (day, key, value) => { day[key] = value; } // zápis hodnoty slotu
}) => {
  const used = new Set();
  const slotKeys = Object.keys(slotTagsMap);

  // Pokud ve slotech máš už vyplněno (třeba názvy), označ je jako použité.
  // Když ukládáš ID, tohle můžeš klidně smazat.
  const titleToId = new Map(recipes.map(r => [r.title, r.id]));
  for (const day of week) {
    for (const key of slotKeys) {
      const val = getSlot(day, key);
      if (!val) continue;
      if (typeof val === "number") used.add(val);            // ID
      else if (typeof val === "string" && titleToId.has(val)) used.add(titleToId.get(val)); // TITLE
    }
  }

  const newWeek = week.map(origDay => {
    const day = { ...origDay };
    for (const slotKey of slotKeys) {
      const currentVal = getSlot(day, slotKey);
      const isEmpty = currentVal === null || currentVal === undefined || String(currentVal).trim?.() === "";

      if (!isEmpty && fillOnlyEmpty) continue;

      const recipe = pickForSlot(recipes, slotTagsMap[slotKey], used);
      if (recipe) {
        // ⬇️ vyber si JEDNU z variant podle toho, co ukládáš do slotu
        setSlot(day, slotKey, recipe.id);     // ✅ doporučeno ukládat ID
        // setSlot(day, slotKey, recipe.title); // alternativa: ukládat název
      }
    }
    return day;
  });

  return newWeek;
};
