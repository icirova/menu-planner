export const readSessionJson = (key, fallbackValue = null) => {
  try {
    const raw = sessionStorage.getItem(key);
    return {
      value: raw ? JSON.parse(raw) : fallbackValue,
      warning: null,
    };
  } catch (error) {
    return {
      value: fallbackValue,
      warning:
        error instanceof Error && error.message
          ? `Nepodařilo se načíst data z úložiště relace. ${error.message}`
          : "Nepodařilo se načíst data z úložiště relace.",
    };
  }
};

export const writeSessionJson = (key, value, label = "data") => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
    return { warning: null };
  } catch (error) {
    return {
      warning:
        error instanceof Error && error.message
          ? `Nepodařilo se uložit ${label} do úložiště relace. ${error.message}`
          : `Nepodařilo se uložit ${label} do úložiště relace.`,
    };
  }
};
