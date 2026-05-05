export const isTauriRuntime = () => false;

export const readJsonFile = async (path) => {
  void path;

  return {
    data: null,
    error: null,
    status: "unavailable",
  };
};

export const writeJsonFile = async (path, value) => {
  void path;
  void value;

  return {
    ok: true,
    error: null,
    status: "unavailable",
  };
};
