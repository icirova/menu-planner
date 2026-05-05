const MAX_SAFE_RECIPE_ID = 9_000_000_000_000_000;

export const normalizeRecipeIdValue = (value) => {
  if (typeof value === "number" && Number.isSafeInteger(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (Number.isSafeInteger(parsed)) {
      return parsed;
    }
  }

  return null;
};

export const areRecipeIdsEqual = (left, right) => {
  const normalizedLeft = normalizeRecipeIdValue(left);
  const normalizedRight = normalizeRecipeIdValue(right);

  if (normalizedLeft !== null && normalizedRight !== null) {
    return normalizedLeft === normalizedRight;
  }

  return String(left) === String(right);
};

export const clampRecipeId = (value) => {
  const normalized = normalizeRecipeIdValue(value);

  if (normalized === null) {
    return null;
  }

  return Math.min(normalized, MAX_SAFE_RECIPE_ID);
};
