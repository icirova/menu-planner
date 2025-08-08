import { useState } from "react";
import "./style.css"

export const IngredientInputs = ({ ingredients, setIngredients }) => {
  const [newIngredient, setNewIngredient] = useState({
    amount: "",
    unit: "",
    item: "",
  });

  const handleChange = (field, value) => {
    setNewIngredient({ ...newIngredient, [field]: value });
  };

  const addIngredient = () => {
  const { amount, unit, item } = newIngredient;

  if (
    item.trim() === "" ||
    unit === "" ||
    isNaN(amount) ||
    Number(amount) <= 0
  ) return;

  setIngredients([...ingredients, newIngredient]);
  setNewIngredient({ amount: "", unit: "", item: "" });
};

  const removeIngredient = (index) => {
    const updated = [...ingredients];
    updated.splice(index, 1);
    setIngredients(updated);
  };

  return (
    <div className="form__item">
      <label className="form__label">Přidat surovinu</label>

      <div className="ingredient-row">
        <input
          type="number"
          placeholder="Množství"
          min="0"
          step="any"
          value={newIngredient.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          className="form__input form__input--amount"
        />

        <select
          value={newIngredient.unit}
          onChange={(e) => handleChange("unit", e.target.value)}
          className="form__input form__input--unit"
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
          placeholder="Název suroviny"
          value={newIngredient.item}
          onChange={(e) => handleChange("item", e.target.value)}
          className="form__input form__input--item"
        />

        <button
          type="button"
          className="button button--add"
          onClick={addIngredient}
        >
          +
        </button>
      </div>

      <div className="ingredient-list">
  {ingredients.map((ing, i) => (
    <span key={i} className="ingredient-item">
      {ing.amount} {ing.unit} {ing.item}
      <button
        type="button"
        className="button--remove"
        onClick={() => removeIngredient(i)}
        title="Odebrat"
      >
        ✕
      </button>
    </span>
  ))}
</div>
    </div>
  );
};
