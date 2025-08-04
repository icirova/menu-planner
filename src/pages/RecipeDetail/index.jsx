import "./style.css";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { recipes } from "../../../data/recipes";
import { ServingsControl } from "../../components/ServingsControl/index";
import { getAllergenIcon } from "../../utils/getAllergenIcon";
import { getSuitabilityIcon } from "../../utils/getSuitabilityIcon";
import { formatIngredient } from "../../utils/formatIngredient";

const IngredientsList = ({ ingredients, baseServings, desiredServings }) => (
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

const AllergenTags = ({ allergens }) => (
  <>
    <h2 className="recipe-detail__subtitle">Alergeny:</h2>
    <div className="recipe-detail__allergen-tags">
      {allergens.map((a, idx) => (
        <span key={idx} className="recipe-detail__tag--allergen">
          {getAllergenIcon(a)} {a}
        </span>
      ))}
    </div>
  </>
);

const SuitabilityTags = ({ suitability }) => (
  <>
    <h2 className="recipe-detail__subtitle">Vhodné pro:</h2>
    <div className="recipe-detail__suitable-tags">
      {suitability.map((s, idx) => (
        <span key={idx} className="recipe-detail__tag">
          {getSuitabilityIcon(s)} {s}
        </span>
      ))}
    </div>
  </>
);

export const RecipeDetail = () => {
  const { id } = useParams();
  const [recipeDetail, setRecipeDetail] = useState(null);
  const [desiredServings, setDesiredServings] = useState(4);

  useEffect(() => {
    const foundRecipe = recipes.find((r) => r.id === parseInt(id));
    if (foundRecipe) {
      setRecipeDetail(foundRecipe);
      setDesiredServings(foundRecipe.servings || 4);
    } else {
      console.warn("Recept nebyl nalezen.");
    }
  }, [id]);

  if (!recipeDetail) {
    return (
      <div className="main">
        <p>Načítání...</p>
        <Link to="/recipes" className="menu__item">
          Zpět
        </Link>
      </div>
    );
  }

  return (
    <div className="main">
      <h1 className="title">{recipeDetail.title}</h1>
      <div className="recipe-detail">
        <div className="recipe-detail__img">
          <img
            src={`../imgRecipe/${recipeDetail.photo_url}`}
            alt=""
            className="recipe-detail__image"
          />
        </div>

        <div className="recipe-detail__text">
          <ServingsControl
            value={desiredServings}
            onChange={(e) => setDesiredServings(parseInt(e.target.value) || 1)}
          />

          <IngredientsList
            ingredients={recipeDetail.ingredients}
            baseServings={recipeDetail.servings}
            desiredServings={desiredServings}
          />

          <h2 className="recipe-detail__subtitle">Postup:</h2>
          <p className="recipe-detail__description">{recipeDetail.workflow}</p>

          {recipeDetail.calories && (
            <>
              <h2 className="recipe-detail__subtitle">Kalorie:</h2>
              <p className="recipe-detail__description">
                {recipeDetail.calories} kcal na 1 porci
              </p>
            </>
          )}

          {recipeDetail.allergens?.length > 0 && (
            <AllergenTags allergens={recipeDetail.allergens} />
          )}

          {recipeDetail.suitableFor?.length > 0 && (
            <SuitabilityTags suitability={recipeDetail.suitableFor} />
          )}
        </div>
      </div>

      <Link to="/recipes" className="menu__item">
        Zpět
      </Link>
    </div>
  );
};
