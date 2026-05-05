const MIN_RECIPE_ID = 1_000_000_000_000;
const RECIPE_ID_SPAN = 8_000_000_000_000_000;

export const createStableId = (prefix = "id") => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  const randomPart = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now()}-${randomPart}`;
};

export const createNumericId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const buffer = new Uint32Array(3);
    crypto.getRandomValues(buffer);
    const high = buffer[0] % 1_000_000;
    const low = buffer[1] * 1_000 + (buffer[2] % 1_000);
    return MIN_RECIPE_ID + ((high * 4_294_967_296 + low) % RECIPE_ID_SPAN);
  }

  return Date.now() * 1000 + Math.floor(Math.random() * 1000);
};
