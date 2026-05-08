import { PANTRY_ITEMS } from "../../constants/pantry.js";
import "./style.css";

export const PantryCard = () => (
  <aside className="card card--overview pantry-card" aria-label="Spíž">
    <div className="pantry-card__header">
      <h3 className="card__title pantry-card__title">Spíž</h3>
      <p className="pantry-card__text">Tyto suroviny nákupní seznam automaticky vynechává.</p>
    </div>

    <ul className="pantry-card__list">
      {PANTRY_ITEMS.map((item) => (
        <li key={item.label} className="pantry-card__item">
          {item.label}
        </li>
      ))}
    </ul>
  </aside>
);
