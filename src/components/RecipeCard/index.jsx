import "./style.css"
import { resolveImageSrc } from "../../utils/resolveImageSrc";


export const RecipeCard = ({ photo_url, title, openDetail }) => {
  const src = resolveImageSrc(photo_url);

  return (
    <div className="recipe">
      <div className="recipe__img" onClick={openDetail}>
        <img src={src} alt={title} className="img" />
      </div>
      <h1 className="recipe__title">{title}</h1>
    </div>
  );
};
