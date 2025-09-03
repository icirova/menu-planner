export const autoGrow = (el) => {
    if (!el) return;
    el.style.height = "0px";
    el.style.height = el.scrollHeight + "px";
    el.style.overflowY = "hidden";
  };