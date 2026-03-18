import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from "react";

export const AutoGrowTextarea = forwardRef(function AutoGrowTextarea(
  { value, style, ...props },
  forwardedRef
) {
  const innerRef = useRef(null);

  useImperativeHandle(forwardedRef, () => innerRef.current);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
    el.style.overflowY = "hidden";
  }, [value]);

  return <textarea ref={innerRef} value={value} style={style} {...props} />;
});
