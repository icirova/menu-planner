import { useEffect, useRef, useState } from "react";

const DRAG_START_DISTANCE = 6;

const resolvePlannerCellFromPoint = (clientX, clientY) => {
  if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) return null;

  const target = document.elementFromPoint(clientX, clientY);
  if (!(target instanceof Element)) return null;

  const plannerCell = target.closest("[data-planner-cell='true']");
  if (!(plannerCell instanceof HTMLElement)) return null;

  const dayIndex = Number(plannerCell.dataset.dayIndex);
  const slotKey = plannerCell.dataset.slotKey;

  if (!Number.isFinite(dayIndex) || typeof slotKey !== "string" || !slotKey) {
    return null;
  }

  return { dayIndex, slotKey };
};

export const usePlannerPointerDrag = ({ commitDraggedPayload }) => {
  const [pointerDrag, setPointerDrag] = useState(null);
  const pointerDragRef = useRef(null);
  const suppressPlannerClickRef = useRef(false);

  const clearPointerDrag = () => {
    pointerDragRef.current = null;
    setPointerDrag(null);
  };

  const handlePlannerPointerDown = (event, dayIndex, slotKey, options = {}) => {
    if (event.button !== 0) return;

    const { recipeId, moveAll = false, label = "" } = options;
    if (!moveAll && typeof recipeId !== "number") return;

    const payload = { dayIndex, slotKey, recipeId, moveAll };
    const nextDrag = {
      payload,
      label,
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
      isActive: false,
      target: null,
    };

    pointerDragRef.current = nextDrag;
    setPointerDrag(nextDrag);
  };

  useEffect(() => {
    if (!pointerDrag) return undefined;

    const handlePointerMove = (event) => {
      const current = pointerDragRef.current;
      if (!current) return;

      const distance = Math.hypot(event.clientX - current.startX, event.clientY - current.startY);
      const isActive = current.isActive || distance >= DRAG_START_DISTANCE;
      const target = isActive ? resolvePlannerCellFromPoint(event.clientX, event.clientY) : null;

      const nextDrag = {
        ...current,
        x: event.clientX,
        y: event.clientY,
        isActive,
        target,
      };

      pointerDragRef.current = nextDrag;
      setPointerDrag(nextDrag);

      if (isActive) {
        event.preventDefault();
      }
    };

    const handlePointerUp = (event) => {
      const current = pointerDragRef.current;
      if (!current) return;

      const target = resolvePlannerCellFromPoint(event.clientX, event.clientY) ?? current.target;
      const didMove = Boolean(current.isActive && target);

      if (didMove) {
        commitDraggedPayload(current.payload, target.dayIndex, target.slotKey);
        suppressPlannerClickRef.current = true;
      }

      clearPointerDrag();
    };

    const handlePointerCancel = () => {
      clearPointerDrag();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, [commitDraggedPayload, pointerDrag]);

  return {
    handlePlannerPointerDown,
    pointerDrag,
    suppressPlannerClickRef,
  };
};
