import { getAllergenMetadata } from "../constants/recipeMetadata";

export const getAllergenIcon = (allergen) =>
  getAllergenMetadata(allergen)?.icon ?? "⚠️";
