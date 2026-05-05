const isExternalImageUrl = (value) =>
  typeof value === "string" &&
  (
    value.startsWith("/") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  );

const isAppAssetPath = (value) =>
  typeof value === "string" &&
  (
    value.startsWith("/image/") ||
    value.startsWith("/imgRecipe/") ||
    value.startsWith("/form.webp") ||
    value.startsWith("/notes.webp") ||
    value.startsWith("/shopping.webp")
  );

const normalizeRecipeImageUrl = (photoUrl) => {
  if (typeof photoUrl !== "string" || !photoUrl.trim()) return null;
  return photoUrl.trim();
};

export const normalizeRecipeImageUrls = (photoUrls = []) =>
  photoUrls.map((photoUrl) => normalizeRecipeImageUrl(photoUrl)).filter(Boolean);

export const resolveStoredImageSrc = (photoUrl) => {
  if (!photoUrl) return "/image/placeholder.png";

  if (photoUrl.startsWith("blob:") || photoUrl.startsWith("data:")) {
    return photoUrl;
  }

  if (isAppAssetPath(photoUrl)) {
    return photoUrl;
  }

  if (isExternalImageUrl(photoUrl)) {
    return photoUrl;
  }

  return `/imgRecipe/${photoUrl}`;
};
