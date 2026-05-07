import { useCallback, useRef } from "react";

export const usePlannerFocus = () => {
  const plannerCellRefs = useRef(new Map());
  const plannerRef = useRef(null);

  const focusPlannerCell = useCallback((dayIndex, slotKey) => {
    window.requestAnimationFrame(() => {
      const refKey = `${dayIndex}-${slotKey}`;
      plannerCellRefs.current.get(refKey)?.focus();
    });
  }, []);

  return {
    focusPlannerCell,
    plannerCellRefs,
    plannerRef,
  };
};
