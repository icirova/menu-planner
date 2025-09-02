import { useState, useRef, useLayoutEffect } from "react";
import "./style.css";

export const ShoppingList = ({ value = "", onChange, forceEditing = false,shouldAutoFocus = false }) => {
  const [editing, setEditing] = useState(false);
  const isEditing = forceEditing || editing;
  const contentRef = useRef(null);   // .card__content (okno karty)
  const taRef = useRef(null);        // <textarea>
  const baseHeightRef = useRef(0);   // základní výška, od které teprve rosteme

  // přečti CSS proměnnou a převeď na px
  const getCssVarPx = (name, fallback = 0) => {
    const cs = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (!cs) return fallback;
    if (cs.endsWith("rem")) {
      const rem = parseFloat(cs);
      const root = parseFloat(getComputedStyle(document.documentElement).fontSize);
      return rem * root;
    }
    if (cs.endsWith("px")) return parseFloat(cs);
    const n = parseFloat(cs);
    return Number.isFinite(n) ? n : fallback;
  };

  // autosize: držíme základní výšku; rosteme až když se obsah nevejde
  const autosize = (el) => {
    if (!el) return;
    const minVarPx = getCssVarPx("--shop-content-min-h", 0);
    if (!baseHeightRef.current) {
      baseHeightRef.current = Math.max(minVarPx, el.clientHeight || 0);
    }
    const contentH = el.scrollHeight;
    const shouldGrow = contentH > baseHeightRef.current + 1;
    if (shouldGrow) {
      el.style.height = contentH + "px";
    }
    el.style.overflowY = "hidden"; // žádný vnitřní scrollbar (scrolluje okno karty)
  };

  const toggleEditing = () => setEditing((v) => !v);
  const clearList = () => onChange("");

  // Po zapnutí editace: nastav základní výšku bez změny layoutu, případně fokus a posun
  useLayoutEffect(() => {
    if (!isEditing) return;
    const ta = taRef.current;
    if (!ta) return;
    baseHeightRef.current = Math.max(getCssVarPx("--shop-content-min-h", 0), ta.clientHeight || 0);
    if (shouldAutoFocus) {
      ta.focus();
      const len = ta.value.length;
      try { ta.setSelectionRange(len, len); } catch {}
      if (contentRef.current) {
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
      }
    }
  }, [isEditing, shouldAutoFocus]);

  return (
    <div className={`card shopping-card ${isEditing ? "is-editing" : ""}`}>
      <img className="card__image" src="./shopping.webp" alt="" />
      <h1 className="card__title">Nákupní seznam</h1>

      <div className="card__toolbar">
        {isEditing && <span className="chip chip--edit" aria-live="polite">✏️</span>}
        <button className="button button--ghost" 
         onClick={() => setEditing(v => !v)}
          disabled={forceEditing}                                
          title={forceEditing ? 'Řízeno tlačítkem „Upravit vše“' : ''}
          >
          {isEditing ? "Hotovo" : "Upravit"}
        </button>
        <button className="button button--danger" onClick={clearList} title="Vymazat seznam">
          Vymazat
        </button>
      </div>

      <div className="card__content" ref={contentRef}>
        {isEditing ? (
          <div className="shopping-card__field">
            <textarea
              ref={taRef}
              className="shopping-card__textarea shopping-card__textarea--withClear"
              placeholder="Seznam položek…"
              value={value}
              onChange={(e) => { onChange(e.target.value); autosize(e.currentTarget); }}
              onInput={(e) => autosize(e.currentTarget)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.currentTarget.blur();
                  if (!forceEditing) setEditing(false);
                }
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!forceEditing) setEditing(false);
                }
              }}
              rows={1}
              autoComplete="off"
              autoFocus={shouldAutoFocus}
            />
            {!!value && (
              <button
                type="button"
                className="button button--icon shopping-card__clear"
                title="Smazat seznam"
                aria-label="Smazat seznam"
                onClick={clearList}
              >
                ✕
              </button>
            )}
          </div>
        ) : (
          <div className="shopping-card__field">
            <div className="shopping-card__view">{value || ""}</div>
          </div>
        )}
      </div>
    </div>
  );
};
