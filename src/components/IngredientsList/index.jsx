import "./style.css";
import { formatIngredient } from "../../utils/formatIngredient.js";

export const IngredientsList = ({ ingredients, baseServings, desiredServings }) => (
  <>
    <ul className="recipe-detail__list">
      {ingredients.map((ing, idx) => (
        <li key={idx}>{formatIngredient(ing, baseServings, desiredServings)}</li>
      ))}
    </ul>
  </>
);
