import "./style.css"
import { formatIngredient } from "../../utils/formatIngredient";

export const IngredientsList = ({ ingredients, baseServings, desiredServings }) => (
  <>
    <h2 className="recipe-detail__subtitle">Suroviny:</h2>
    <ul className="recipe-detail__list">
      {ingredients.map((ing, idx) => (
        <li key={idx}>
          {formatIngredient(ing, baseServings, desiredServings)}
        </li>
      ))}
    </ul>
  </>
);