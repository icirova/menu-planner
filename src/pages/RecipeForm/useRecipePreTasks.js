import { useState } from "react";
import { normalizeRecipePreTasks } from "../../utils/normalizeRecipePreTasks.js";

export const useRecipePreTasks = ({ preTasksText, setPreTasksText }) => {
  const [preTaskDraft, setPreTaskDraft] = useState("");
  const preTaskItems = normalizeRecipePreTasks(preTasksText);

  const updatePreTasks = (items) => setPreTasksText(items.join("\n"));

  const addPreTask = () => {
    const nextTask = preTaskDraft.trim();
    if (!nextTask) return;
    updatePreTasks([...preTaskItems, nextTask]);
    setPreTaskDraft("");
  };

  const removePreTask = (indexToRemove) => {
    updatePreTasks(preTaskItems.filter((_, index) => index !== indexToRemove));
  };

  const getSubmittedPreTasksText = () => {
    const pendingTask = preTaskDraft.trim();
    if (!pendingTask) return preTasksText;
    return [...preTaskItems, pendingTask].join("\n");
  };

  const handlePreTaskKeyDown = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    addPreTask();
  };

  return {
    addPreTask,
    getSubmittedPreTasksText,
    handlePreTaskKeyDown,
    preTaskDraft,
    preTaskItems,
    removePreTask,
    setPreTaskDraft,
  };
};
