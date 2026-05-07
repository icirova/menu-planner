export const RECIPE_SOURCE = {
  SEED: "seed",
  CUSTOM: "custom",
};

export const isSeedRecipe = (recipe) => recipe?.source === RECIPE_SOURCE.SEED;
