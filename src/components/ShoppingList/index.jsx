import { useMemo, useState } from "react";
import "./style.css";
import {
  getShoppingListItems,
  getShoppingStateForWeek,
  normalizeShoppingState,
} from "../../utils/shoppingList";
import { createStableId } from "../../utils/createId";

const createEmptyCustomItem = () => ({
  label: "",
});

export const ShoppingList = ({
  value,
  week = [],
  recipes = [],
  onChange,
  forceEditing = false,
  showTitle = true,
}) => {
  const shopping = useMemo(
    () => getShoppingStateForWeek(value, week, recipes),
    [recipes, value, week],
  );
  const { generatedItems, customItems } = useMemo(
    () => getShoppingListItems(shopping, week, recipes),
    [recipes, shopping, week],
  );
  const [draftItem, setDraftItem] = useState(createEmptyCustomItem);

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
    <div
      className={`card shopping-card ${forceEditing ? "is-editing" : ""} ${showTitle ? "" : "shopping-card--embedded"}`}
    >
      {showTitle && <h1 className="card__title">Nákupní seznam</h1>}

      <div className="card__content">
        <section className={`shopping-card__section ${generatedItems.length ? "shopping-card__section--flush" : ""}`}>
          {!generatedItems.length && (
            <p className="shopping-card__empty">Ze zvolených denních seznamů zatím nevznikly žádné položky.</p>
          )}

          {generatedItems.length > 0 && (
            <ul className="shopping-card__taskList">
              {generatedItems.map((item) => (
                <li
                  key={item.id}
                  className={`shopping-card__taskItem ${item.done ? "is-complete" : ""}`}
                >
                  <button
                    type="button"
                    className="shopping-card__toggle"
                    onClick={() => toggleGeneratedItem(item.id)}
                  >
                    <span className={`shopping-card__check ${item.done ? "is-complete" : ""}`} aria-hidden="true">
                      {item.done ? "✓" : ""}
                    </span>
                    <span className="shopping-card__taskMain">
                      <strong className="shopping-card__taskText">{item.label}</strong>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="shopping-card__section">
          <form className="shopping-card__noteForm" onSubmit={handleAddCustomItem}>
            <input
              type="text"
              className="shopping-card__noteInput"
              placeholder="Přidat vlastní ingredienci nebo položku"
              value={draftItem.label}
              onChange={(event) => setDraftItem((current) => ({ ...current, label: event.target.value }))}
            />
            <button type="submit" className="button button--add">Přidat</button>
          </form>

          {customItems.length > 0 ? (
            <ul className="shopping-card__notesList">
              {customItems.map((item) => (
                <li key={item.id} className={`shopping-card__noteItem ${item.done ? "is-complete" : ""}`}>
                  <span className="shopping-card__taskMain">
                    <strong className="shopping-card__taskText">{item.label}</strong>
                  </span>
                  {!item.done && (
                    <button
                      type="button"
                      className="button--remove-control shopping-card__remove"
                      onClick={() => removeCustomItem(item.id)}
                      aria-label={`Smazat položku ${item.label}`}
                      title="Smazat položku"
                    >
                      ×
                    </button>
                  )}
                  <button
                    type="button"
                    className="shopping-card__checkButton"
                    onClick={() => toggleCustomItem(item.id)}
                  >
                    <span className={`shopping-card__check ${item.done ? "is-complete" : ""}`} aria-hidden="true">
                      {item.done ? "✓" : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="shopping-card__empty">Zatím bez vlastních položek.</p>
          )}
        </section>
      </div>
    </div>
  );
};
