import "./style.css";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AllergenTags } from "../../components/AllergenTags";
import { SuitabilityTags } from "../../components/SuitabilityTags";
import { ServingsControl } from "../../components/ServingsControl";
import { IngredientsList } from "../../components/IngredientsList";
import { RecipeTags } from "../../components/RecipeTags";
import { useOutletContext } from "react-router-dom";
import { resolveImageSrc } from "../../utils/resolveImageSrc";

export const RecipeDetail = () => {
  const { id } = useParams();
  const [recipeDetail, setRecipeDetail] = useState(null);
  const [desiredServings, setDesiredServings] = useState(4);
  const { recipeList } = useOutletContext();

  useEffect(() => {
    const foundRecipe = recipeList.find((r) => r.id === parseInt(id, 10));
    if (foundRecipe) {
      setRecipeDetail(foundRecipe);
      setDesiredServings(foundRecipe.servings || 4);
    } else {
      console.warn("Recept nebyl nalezen.");
    }
  }, [id, recipeList]);

  if (!recipeDetail) {
    return (
      <div className="main">
        <p>Načítání...</p>
        <Link to="/recipes" className="menu__item">Zpět</Link>
      </div>
    );
  }

  // <<< AŽ TADY pracuj s recipeDetail >>>
  const coverSrc = resolveImageSrc(recipeDetail?.photo_urls?.[0] ?? "");
  const gallery = (recipeDetail?.photo_urls ?? []).slice(1).map(resolveImageSrc);

  return (
    <div className="main">
      <h1 className="title">{recipeDetail.title}</h1>
      <div className="recipe-detail">
        <div className="recipe-detail__img">
          <img
            src={coverSrc || "/placeholder.webp"}
            alt={recipeDetail.title}
            className="recipe-detail__image"
          />
        </div>

        <div className="recipe-detail__text">
          {recipeDetail.calories && (
            <p className="recipe-detail__description">
              ⚖️ {recipeDetail.calories} kcal na 1 porci
            </p>
          )}

          <ServingsControl
            value={desiredServings}
            onChange={(e) => setDesiredServings(parseInt(e.target.value, 10) || 1)}
          />

          <IngredientsList
            ingredients={recipeDetail.ingredients}
            baseServings={recipeDetail.servings}
            desiredServings={desiredServings}
          />

          <h2 className="recipe-detail__subtitle">Postup:</h2>
          <p className="recipe-detail__description">{recipeDetail.workflow}</p>

          {recipeDetail.allergens?.length > 0 && (
            <AllergenTags allergens={recipeDetail.allergens} />
          )}

          {recipeDetail.suitableFor?.length > 0 && (
            <SuitabilityTags suitability={recipeDetail.suitableFor} />
          )}

          {recipeDetail.tags?.length > 0 && <RecipeTags tags={recipeDetail.tags} />}
        </div>
      </div>

      {gallery.length > 0 && (
        <>
          <h2 className="recipe-detail__subtitle">Galerie</h2>
          <div className="recipe-detail__gallery">
            {gallery.map((src, i) => (
              <img
                key={`${recipeDetail.id}-${i}`}
                src={src}
                alt={`${recipeDetail.title} – foto ${i + 2}`}
                className="recipe-detail__thumb"
              />
            ))}
          </div>
        </>
      )}

      <Link to="/recipes" className="menu__item button">Zpět</Link>
    </div>
  );
};
