const isExternalImageUrl = (value) =>
  typeof value === "string" &&
  (
    value.startsWith("/") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("asset:") ||
    value.startsWith("http://asset.localhost")
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

export const materializeRecipeImageUrl = async (photoUrl) => {
  if (typeof photoUrl !== "string" || !photoUrl.trim()) return null;
  return photoUrl;
};

export const materializeRecipeImageUrls = async (photoUrls = []) => {
  const materialized = await Promise.all(
    photoUrls.map((photoUrl) => materializeRecipeImageUrl(photoUrl)),
  );

  return materialized.filter(Boolean);
};

export const serializeRecipeImageUrl = async (photoUrl) => {
  if (typeof photoUrl !== "string" || !photoUrl.trim()) return null;
  return photoUrl;
};

export const serializeRecipeImageUrls = async (photoUrls = []) => {
  const serialized = await Promise.all(
    photoUrls.map((photoUrl) => serializeRecipeImageUrl(photoUrl)),
  );

  return serialized.filter(Boolean);
};

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
