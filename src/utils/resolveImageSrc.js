export function resolveImageSrc(photo_url) {
  if (!photo_url) return "/placeholder.webp";

  // blob/base64
  if (photo_url.startsWith("blob:") || photo_url.startsWith("data:")) {
    return photo_url;
  }

  // už plná/absolutní URL
  if (/^https?:\/\//i.test(photo_url) || photo_url.startsWith("/")) {
    return photo_url;
  }

  // staré recepty: jen název souboru v public/imgRecipe
  return `/imgRecipe/${photo_url}`;
}

// Volitelné: default export, kdybys někde importovala bez složených závorek
export default resolveImageSrc;
