import { DAYS } from "../constants/days.js";
import { MEAL_KEYS } from "../constants/mealKeys.js";
import { getSlotRecipeIds } from "../utils/mealSlots.js";
import { normalizeRecipePreTasks } from "../utils/normalizeRecipePreTasks.js";

const TASK_KEY_LOCALE = "cs-CZ";

const normalizeTaskKey = (task) =>
  String(task ?? "")
    .trim()
    .toLocaleLowerCase(TASK_KEY_LOCALE);

const createPrepTaskId = (dayIndex, task) =>
  `prep-${dayIndex}-${encodeURIComponent(normalizeTaskKey(task))}`;

const getRecipesById = (recipes = []) => new Map(recipes.map((recipe) => [recipe.id, recipe]));

const getUniqueRecipeIdsForDay = (day) => [
  ...new Set(MEAL_KEYS.flatMap(({ key }) => getSlotRecipeIds(day?.[key]))),
];

export const getWeeklyGeneratedTasks = (week = [], recipes = []) => {
  const recipesById = getRecipesById(recipes);
  const seen = new Set();

  return week.flatMap((day, dayIndex) => {
    const recipeIdsForDay = getUniqueRecipeIdsForDay(day);

    return recipeIdsForDay.flatMap((recipeId) => {
      const recipe = recipesById.get(recipeId);
      if (!recipe) return [];
      const tasks = [...new Set(normalizeRecipePreTasks(recipe.preTasks))];

      return tasks.flatMap((task) => {
        const dedupeKey = `${dayIndex}-${normalizeTaskKey(task)}`;
        if (seen.has(dedupeKey)) return [];
        seen.add(dedupeKey);

        return [
          {
            id: createPrepTaskId(dayIndex, task),
            dayLabel: DAYS[(dayIndex + DAYS.length - 1) % DAYS.length],
            recipeTitle: recipe.title,
            task,
          },
        ];
      });
    });
  });
};

export const getWeeklyExtraItems = (week = [], recipes = []) => {
  const recipesById = getRecipesById(recipes);

  return week.flatMap((day, dayIndex) =>
    getSlotRecipeIds(day?.extra).flatMap((recipeId) => {
      const recipe = recipesById.get(recipeId);
      if (!recipe) return [];

      return [
        {
          id: `extra-${dayIndex}-${recipe.id}`,
          dayLabel: DAYS[dayIndex],
          recipeTitle: recipe.title,
        },
      ];
    }),
  );
};

export const groupWeeklyGeneratedTasks = (generatedTasks = []) => {
  const groups = new Map();

  generatedTasks.forEach((item) => {
    const group = groups.get(item.dayLabel);
    if (group) {
      group.tasks.push(item);
    } else {
      groups.set(item.dayLabel, {
        dayLabel: item.dayLabel,
        tasks: [item],
      });
    }
  });

  return Array.from(groups.values());
};
