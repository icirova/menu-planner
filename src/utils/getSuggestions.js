import { getTitle } from "./getTitle";
export const getSuggestions = (recipes = [], query = "", limit = 6) => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return [];
    return recipes
      .filter((r) => getTitle(r).toLowerCase().includes(q))
      .slice(0, limit);
  };