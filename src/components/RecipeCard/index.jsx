import { Link } from "react-router-dom";
import { resolveImageSrc } from "../../utils/resolveImageSrc";
import "./style.css";

export const RecipeCard = ({
  id,
  title,
  photo_urls = [],
  isSelected = false,
  onAddToPlan,
}) => {
  const cover = resolveImageSrc(photo_urls[0] || "/image/placeholder.png");
  const titleId = `recipe-title-${id}`;

  return (
    <li className={`recipe ${isSelected ? "recipe--selected" : ""}`}>
      <Link
        to={`/recipe-detail/${id}`}
        className="recipe__detail-link"
        aria-label={`Zobrazit detail receptu ${title}`}
        title="Zobrazit detail receptu"
      >
        <span className="recipe__detail-icon" aria-hidden="true">i</span>
      </Link>

      <button
        type="button"
        className="recipe__link recipe__linkButton"
        aria-labelledby={titleId}
        aria-pressed={isSelected}
        title={isSelected ? "Recept je vybraný pro plánování" : "Vybrat recept pro plánování"}
        onClick={() => onAddToPlan?.(id)}
      >
        <div className="recipe__img" aria-hidden="true">
          <img src={cover} alt="" className="img" />
        </div>

        <h2 id={titleId} className="recipe__title">{title}</h2>
      </button>
    </li>
  );
};
