import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import "./style.css";

const createEmptyIngredient = () => ({ amount: "", unit: "", item: "" });

export const IngredientInputs = forwardRef(({ ingredients, setIngredients }, ref) => {
  const [newIngredient, setNewIngredient] = useState({ amount: "", unit: "", item: "" });
  const rowRef = useRef(null);

  const getValidatedIngredient = () => {
    const { amount, unit, item } = newIngredient;
    const parsedAmount = parseFloat(amount);

    if (!item.trim() || !unit || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return null;
    }

    return {
      amount: parsedAmount,
      unit,
      item: item.trim(),
    };
  };

  const handleChange = (field, value) => {
    // tiše převést , -> . u množství
    const v = field === "amount" ? value.replace(",", ".") : value;
    setNewIngredient((prev) => ({ ...prev, [field]: v }));
  };

  const addIngredient = () => {
    const ingredient = getValidatedIngredient();
    if (!ingredient) return;

    setIngredients((prev) => [...prev, ingredient]);
    setNewIngredient(createEmptyIngredient());

    // vrátit fokus na první pole pro rychlé zadávání
    rowRef.current?.querySelector('input[name="amount"]')?.focus();
  };

  useImperativeHandle(ref, () => ({
    flushDraftIngredient(currentIngredients = []) {
      const ingredient = getValidatedIngredient();

      if (!ingredient) {
        return currentIngredients;
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
    <div className="form__item">
      <label className="form__label">Přidat surovinu</label>

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

      {/* Seznam surovin – oznamuj změny čtečce */}
      <ul className="ingredient-list" role="list" aria-live="polite">
        {ingredients.map((ing, i) => (
          <li key={i} className="ingredient-item">
            <span className="ingredient-text">
              {ing.amount} {ing.unit} {ing.item}
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
    </div>
  );
});
