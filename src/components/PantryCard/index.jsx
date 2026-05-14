import { PANTRY_ITEMS } from "../../constants/pantry.js";
import "./style.css";

const pantryGroups = PANTRY_ITEMS.reduce((groups, item) => {
  const lastGroup = groups.at(-1);

  if (lastGroup?.category === item.category) {
    lastGroup.items.push(item);
    return groups;
  }

  groups.push({ category: item.category, items: [item] });
  return groups;
}, []);

export const PantryCard = () => (
  <aside className="card card--overview pantry-card" aria-label="Spíž">
    <div className="pantry-card__header">
      <h3 className="card__title pantry-card__title">Spíž</h3>
      <p className="pantry-card__text">Tyto suroviny nákupní seznam automaticky vynechává.</p>
    </div>

    <div className="pantry-card__groups">
      {pantryGroups.map((group, groupIndex) => (
        <ul
          key={`${group.category}-${groupIndex}`}
          className="pantry-card__list"
          aria-label={group.category}
        >
          {group.items.map((item) => (
            <li key={item.label} className="pantry-card__item">
              {item.label}
            </li>
          ))}
        </ul>
      ))}
    </div>
  </aside>
);
