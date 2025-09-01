import { useState, useRef } from "react";
import "./style.css";

export const IngredientInputs = ({ ingredients, setIngredients }) => {
  const [newIngredient, setNewIngredient] = useState({ amount: "", unit: "", item: "" });
  const rowRef = useRef(null);

  const handleChange = (field, value) => {
    // tiše převést , -> . u množství
    const v = field === "amount" ? value.replace(",", ".") : value;
    setNewIngredient((prev) => ({ ...prev, [field]: v }));
  };

  const addIngredient = () => {
    const { amount, unit, item } = newIngredient;
    const a = parseFloat(amount);
    if (!item.trim() || !unit || !Number.isFinite(a) || a <= 0) return;

    setIngredients((prev) => [...prev, { amount: a, unit, item: item.trim() }]);
    setNewIngredient({ amount: "", unit: "", item: "" });

    // vrátit fokus na první pole pro rychlé zadávání
    rowRef.current?.querySelector('input[name="amount"]')?.focus();
  };

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
          +
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
              className="button button--icon button--danger"
              onClick={() => removeIngredient(i)}
              title="Odebrat surovinu"
              aria-label={`Odebrat ${ing.amount} ${ing.unit} ${ing.item}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
