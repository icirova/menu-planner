export const MEAL_KEYS = [
  { key: "breakfast", label: "Snídaně" },
  { key: "snack1", label: "Svačina" },
  { key: "lunch", label: "Oběd" },
  { key: "snack2", label: "Svačina" },
  { key: "dinner", label: "Večeře" },
  { key: "extra", label: "EXTRA", optional: true },
];

export const PLANNED_MEAL_KEYS = MEAL_KEYS.filter(({ optional }) => !optional);
