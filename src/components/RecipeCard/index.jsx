import { Link } from "react-router-dom";
import "./style.css";

export const RecipeCard = ({ id, title, photo_urls = [] }) => {
  const cover = photo_urls[0] || "/image/placeholder.png";
  const titleId = `recipe-title-${id}`;

  return (
    <li className="recipe">
      <Link
        to={`/recipe-detail/${id}`}
        className="recipe__link"
        aria-labelledby={titleId}
      >
        <div className="recipe__img" aria-hidden="true">
          <img src={cover} alt="" className="img" />
        </div>

    
        <h2 id={titleId} className="recipe__title">{title}</h2>

        
      </Link>
    </li>
  );
};
