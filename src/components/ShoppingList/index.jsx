import { useMemo, useState } from "react";
import "./style.css";
import {
  getShoppingListItems,
  getShoppingStateForWeek,
  normalizeShoppingState,
} from "../../utils/shoppingList.js";
import { createStableId } from "../../utils/createId.js";

const createEmptyCustomItem = () => ({
  label: "",
});

export const ShoppingList = ({ value, week = [], recipes = [], onChange, showTitle = true }) => {
  const shopping = useMemo(
    () => getShoppingStateForWeek(value, week, recipes),
    [recipes, value, week],
  );
  const { generatedItems, customItems } = useMemo(
    () => getShoppingListItems(shopping, week, recipes),
    [recipes, shopping, week],
  );
  const [draftItem, setDraftItem] = useState(createEmptyCustomItem);
  const canAddCustomItem = draftItem.label.trim() !== "";
  const hasShoppingItems = generatedItems.length > 0 || customItems.length > 0;

  const updateShopping = (updater) => {
    const nextValue = typeof updater === "function" ? updater(shopping) : updater;
    onChange(normalizeShoppingState(nextValue));
  };

  const toggleGeneratedItem = (itemId) => {
    updateShopping((current) => ({
      ...current,
      overrides: {
        ...current.overrides,
        [itemId]: {
          done: !current.overrides[itemId]?.done,
        },
      },
    }));
  };

  const toggleCustomItem = (itemId) => {
    updateShopping((current) => ({
      ...current,
      customItems: current.customItems.map((item) =>
        item.id === itemId ? { ...item, done: !item.done } : item,
      ),
    }));
  };

  const addCustomItem = () => {
    if (!draftItem.label.trim()) return;

    updateShopping((current) => ({
      ...current,
      customItems: [
        ...current.customItems,
        {
          id: createStableId("custom"),
          label: draftItem.label.trim(),
          done: false,
        },
      ],
    }));

    setDraftItem(createEmptyCustomItem());
  };

  const removeCustomItem = (itemId) => {
    updateShopping((current) => ({
      ...current,
      customItems: current.customItems.filter((item) => item.id !== itemId),
    }));
  };

  const handleAddCustomItem = (event) => {
    event.preventDefault();
    addCustomItem();
  };

  return (
    <div className={`card shopping-card ${showTitle ? "" : "shopping-card--embedded"}`}>
      {showTitle && <h1 className="card__title">Nákupní seznam</h1>}

      <div className="card__content">
        <section className="shopping-card__section">
          {hasShoppingItems ? (
            <ul className="shopping-card__item-list">
              {generatedItems.map((item) => (
                <li
                  key={item.id}
                  className={`shopping-card__item ${item.done ? "is-complete" : ""}`}
                >
                  <button
                    type="button"
                    className="shopping-card__toggle"
                    onClick={() => toggleGeneratedItem(item.id)}
                  >
                    <span
                      className={`shopping-card__check ${item.done ? "is-complete" : ""}`}
                      aria-hidden="true"
                    >
                      {item.done ? "✓" : ""}
                    </span>
                    <span className="shopping-card__task-main">
                      <strong className="shopping-card__task-text">{item.label}</strong>
                    </span>
                  </button>
                </li>
              ))}

              {customItems.map((item) => (
                <li
                  key={item.id}
                  className={`shopping-card__item shopping-card__item--custom ${item.done ? "is-complete" : ""}`}
                >
                  <button
                    type="button"
                    className="shopping-card__toggle"
                    onClick={() => toggleCustomItem(item.id)}
                  >
                    <span
                      className={`shopping-card__check ${item.done ? "is-complete" : ""}`}
                      aria-hidden="true"
                    >
                      {item.done ? "✓" : ""}
                    </span>
                    <span className="shopping-card__task-main">
                      <strong className="shopping-card__task-text">{item.label}</strong>
                    </span>
                  </button>
                  {!item.done && (
                    <button
                      type="button"
                      className="shopping-card__remove"
                      onClick={() => removeCustomItem(item.id)}
                      aria-label={`Smazat položku ${item.label}`}
                      title="Smazat položku"
                    >
                      ×
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="shopping-card__empty">Zatím bez položek.</p>
          )}

          <form className="shopping-card__note-form" onSubmit={handleAddCustomItem}>
            <input
              type="text"
              className="shopping-card__note-input"
              placeholder="Přidat vlastní položku"
              value={draftItem.label}
              onChange={(event) =>
                setDraftItem((current) => ({ ...current, label: event.target.value }))
              }
            />
            <button type="submit" className="button button--add" disabled={!canAddCustomItem}>
              Přidat
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};
