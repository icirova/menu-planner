import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getWeeklyExtraItems,
  getWeeklyGeneratedTasks,
  groupWeeklyGeneratedTasks,
} from "../src/selectors/weeklyTaskSelectors.js";

const recipes = [
  {
    id: 1,
    title: "Čočková polévka",
    preTasks: ["Namočit čočku", "Nakrájet zeleninu"],
  },
  {
    id: 2,
    title: "Rizoto",
    preTasks: ["Nakrájet zeleninu", "Připravit vývar"],
  },
  {
    id: 3,
    title: "Koláč",
    preTasks: ["Vyndat máslo"],
  },
];

describe("weekly task selectors", () => {
  it("builds prep tasks from planned recipes and deduplicates repeated tasks per day", () => {
    const tasks = getWeeklyGeneratedTasks([{ lunch: [1], dinner: [2] }], recipes);

    assert.deepEqual(tasks, [
      {
        id: "prep-0-namo%C4%8Dit%20%C4%8Do%C4%8Dku",
        dayLabel: "Neděle",
        recipeTitle: "Čočková polévka",
        task: "Namočit čočku",
      },
      {
        id: "prep-0-nakr%C3%A1jet%20zeleninu",
        dayLabel: "Neděle",
        recipeTitle: "Čočková polévka",
        task: "Nakrájet zeleninu",
      },
      {
        id: "prep-0-p%C5%99ipravit%20v%C3%BDvar",
        dayLabel: "Neděle",
        recipeTitle: "Rizoto",
        task: "Připravit vývar",
      },
    ]);
  });

  it("keeps prep task ids stable when recipe pre-task order changes", () => {
    const original = getWeeklyGeneratedTasks([{ lunch: [1] }], recipes)
      .map((task) => task.id)
      .sort();
    const reordered = getWeeklyGeneratedTasks(
      [{ lunch: [1] }],
      [
        {
          id: 1,
          title: "Čočková polévka",
          preTasks: ["Nakrájet zeleninu", "Namočit čočku"],
        },
      ],
    )
      .map((task) => task.id)
      .sort();

    assert.deepEqual(reordered, original);
  });

  it("builds extra task items from the extra slot", () => {
    assert.deepEqual(getWeeklyExtraItems([{ extra: [3] }, { extra: [1, 999] }], recipes), [
      {
        id: "extra-0-3",
        dayLabel: "Pondělí",
        recipeTitle: "Koláč",
      },
      {
        id: "extra-1-1",
        dayLabel: "Úterý",
        recipeTitle: "Čočková polévka",
      },
    ]);
  });

  it("groups generated prep tasks by day label", () => {
    const grouped = groupWeeklyGeneratedTasks([
      { id: "a", dayLabel: "Pondělí", task: "A" },
      { id: "b", dayLabel: "Pondělí", task: "B" },
      { id: "c", dayLabel: "Úterý", task: "C" },
    ]);

    assert.equal(grouped.length, 2);
    assert.deepEqual(
      grouped[0].tasks.map((task) => task.id),
      ["a", "b"],
    );
    assert.deepEqual(
      grouped[1].tasks.map((task) => task.id),
      ["c"],
    );
  });
});
