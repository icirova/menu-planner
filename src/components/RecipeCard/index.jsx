import "./style.css"


export const RecipeCard = ({photo_url, title, openDetail}) => {
  return <div className="recipe">
    <div className="recipe_img" onClick={openDetail}>
        <img src={`./imgRecipe/${photo_url}`} alt={title} className="img" />
        <h1 className="recipe__title">{title}</h1>
    </div>
  </div>
}
