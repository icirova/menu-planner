import "./style.css";

export const RecipeCard = ({ title, photo_urls = [], openDetail }) => {
  const cover = photo_urls[0] || "/placeholder.webp";

  return (
    <div className="recipe">
      <div className="recipe__img" onClick={openDetail}>
        <img src={cover} alt={title} className="img" />
      </div>
      <h1 className="recipe__title">{title}</h1>
    </div>
  );
};
