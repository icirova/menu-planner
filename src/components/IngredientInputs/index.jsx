import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import "./style.css";
import { formatIngredient } from "../../utils/formatIngredient.js";
import { getCanonicalIngredientName } from "../../utils/ingredientNames.js";

const createEmptyIngredient = () => ({ amount: "", unit: "", item: "" });

export const IngredientInputs = forwardRef(({ ingredients, setIngredients, onValidationError }, ref) => {
  const [newIngredient, setNewIngredient] = useState({ amount: "", unit: "", item: "" });
  const rowRef = useRef(null);

  const focusDraftField = (fieldName) => {
    rowRef.current?.querySelector(`[name="${fieldName}"]`)?.focus();
  };

  const getDraftValidation = () => {
    const { amount, unit, item } = newIngredient;
    const hasDraft = amount.trim() !== "" || unit !== "" || item.trim() !== "";
    const parsedAmount = parseFloat(amount);

    if (!hasDraft) {
      return { ingredient: null, isEmpty: true, errorField: null };
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return { ingredient: null, isEmpty: false, errorField: "amount" };
    }

    if (!unit) {
      return { ingredient: null, isEmpty: false, errorField: "unit" };
    }

    if (!item.trim()) {
      return { ingredient: null, isEmpty: false, errorField: "item" };
    }

    return {
      ingredient: {
        amount: parsedAmount,
        unit,
        item: getCanonicalIngredientName(item),
      },
      isEmpty: false,
      errorField: null,
    };
  };

  const reportDraftError = (fieldName) => {
    onValidationError?.("Rozpracovaná surovina musí mít množství, jednotku i název.");
    focusDraftField(fieldName);
  };

  const handleChange = (field, value) => {
    // tiše převést , -> . u množství
    const v = field === "amount" ? value.replace(",", ".") : value;
    setNewIngredient((prev) => ({ ...prev, [field]: v }));
  };

  const addIngredient = () => {
    const { ingredient, isEmpty, errorField } = getDraftValidation();
    if (isEmpty) return;

    if (!ingredient) {
      reportDraftError(errorField);
      return;
    }

    setIngredients((prev) => [...prev, ingredient]);
    setNewIngredient(createEmptyIngredient());

    // vrátit fokus na první pole pro rychlé zadávání
    rowRef.current?.querySelector('input[name="amount"]')?.focus();
  };

  useImperativeHandle(ref, () => ({
    focusItemField() {
      focusDraftField("item");
    },

    flushDraftIngredient(currentIngredients = []) {
      const { ingredient, isEmpty, errorField } = getDraftValidation();

      if (isEmpty) {
        return currentIngredients;
      }

      if (!ingredient) {
        reportDraftError(errorField);
        return null;
      }

      const nextIngredients = [...currentIngredients, ingredient];
      setIngredients(nextIngredients);
      setNewIngredient(createEmptyIngredient());
      return nextIngredients;
    },
  }), [newIngredient, setIngredients]);

  const removeIngredient = (index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const onRowKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // neodesílej formulář
      addIngredient();
    }
  };

  return (
    <div className="recipe-form-page__subsection form__item">
      <div className="ingredient-editor">
        <div className="ingredient-editor__add">
          <label className="form__label">
            Přidat surovinu <span className="form__required-mark" aria-hidden="true">*</span>
          </label>

          <div className="ingredient-row" ref={rowRef} onKeyDown={onRowKeyDown}>
            <input
              type="number"
              name="amount"
              placeholder="Množství"
              min="0"
              step="any"
              inputMode="decimal"
              value={newIngredient.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              className="form__input form__input--amount"
              aria-label="Množství"
            />

            <select
              value={newIngredient.unit}
              onChange={(e) => handleChange("unit", e.target.value)}
              className="form__input form__input--unit"
              aria-label="Jednotka"
            >
              <option value="">-- Jednotka --</option>
              <option value="g">g</option>
              <option value="kg">kg</option>
              <option value="ml">ml</option>
              <option value="l">l</option>
              <option value="ks">ks</option>
              <option value="hrnek">hrnek</option>
              <option value="lžíce">lžíce</option>
              <option value="lžička">lžička</option>
              <option value="špetka">špetka</option>
            </select>

            <input
              type="text"
              name="item"
              placeholder="Název suroviny"
              value={newIngredient.item}
              onChange={(e) => handleChange("item", e.target.value)}
              className="form__input form__input--item"
              aria-label="Název suroviny"
            />

            <button type="button" className="button button--add" onClick={addIngredient} aria-label="Přidat surovinu">
              Přidat
            </button>
          </div>
        </div>

        <div className="ingredient-editor__list">
          {ingredients.length > 0 ? (
            <ul className="ingredient-list" role="list" aria-live="polite">
              {ingredients.map((ing, i) => (
                <li key={i} className="ingredient-item">
                  <span className="ingredient-text">
                    {formatIngredient(ing, 1, 1)}
                  </span>
                  <button
                    type="button"
                    className="button--remove-control"
                    onClick={() => removeIngredient(i)}
                    title="Odebrat surovinu"
                    aria-label={`Odebrat ${ing.amount} ${ing.unit} ${ing.item}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="ingredient-empty">Zatím bez surovin.</p>
          )}
        </div>
      </div>
    </div>
  );
});
