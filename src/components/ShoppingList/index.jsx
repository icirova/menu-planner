import { useState, useRef, useLayoutEffect } from "react";
import "./style.css"; // jen shopping-card styly

export const ShoppingList = ({ value = "", onChange }) => {
  const [editing, setEditing] = useState(false);
  const contentRef = useRef(null);   // .card__content (okno karty)
  const taRef = useRef(null);        // <textarea>

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

  // autosize: min = --shop-content-min-h, zároveň min = výška okna karty
  const autosize = (el) => {
    if (!el) return;
    el.style.height = "0px"; // reset pro přesný scrollHeight

    const contentH = el.scrollHeight;                            // výška obsahu
    const minVarPx = getCssVarPx("--shop-content-min-h", 0);     // např. 16rem => px
    const winPx = contentRef.current?.clientHeight || 0;         // aktuální výška okna karty

    const next = Math.max(contentH, minVarPx, winPx);
    el.style.height = next + "px";
    el.style.overflowY = "hidden"; // žádný vnitřní scrollbar (scrolluje okno karty)
  };

  const toggleEditing = () => setEditing((v) => !v);
  const clearList = () => onChange("");

  // Po zapnutí editace: dorovnej výšku, focusni a skoč kurzorem na konec
  useLayoutEffect(() => {
    if (!editing) return;
    const ta = taRef.current;
    if (!ta) return;
    autosize(ta);
    ta.focus();
    const len = ta.value.length;
    try { ta.setSelectionRange(len, len); } catch {}
    // posuň okno karty na spodek, ať je konec textu vidět
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [editing]);

  return (
    <div className={`card shopping-card ${editing ? "is-editing" : ""}`}>
      <img className="card__image" src="./shopping.webp" alt="" />
      <h1 className="card__title">Nákupní seznam</h1>

      <div className="card__toolbar">
        {editing && <span className="chip chip--edit" aria-live="polite">✏️</span>}
        <button className="button button--ghost" onClick={toggleEditing}>
          {editing ? "Hotovo" : "Upravit"}
        </button>
        <button className="button button--danger" onClick={clearList} title="Vymazat seznam">
          Vymazat
        </button>
      </div>

      <div className="card__content" ref={contentRef}>
        {editing ? (
          <div className="shopping-card__field">
            <textarea
              ref={taRef}
              className="shopping-card__textarea shopping-card__textarea--withClear"
              placeholder="Seznam položek…"
              value={value}
              onChange={(e) => { onChange(e.target.value); autosize(e.currentTarget); }}
              onInput={(e) => autosize(e.currentTarget)}
              onFocus={(e) => autosize(e.currentTarget)}
              rows={1}
              autoComplete="off"
              autoFocus
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
