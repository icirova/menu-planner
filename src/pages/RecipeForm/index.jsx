import "./style.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import { IngredientInputs } from "../../components/IngredientInputs/index";
import { useState } from "react";

export const RecipeForm = () => {
  const navigate = useNavigate();
  const { addRecipe } = useOutletContext();

  const [ingredients, setIngredients] = useState([]);

  const handleSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const tags = formData.getAll("tags"); 
  const suitableFor = formData.getAll("suitableFor"); 
  const allergens = formData.getAll("allergens")

  const newRecipe = {
    id: Date.now(),
    title: formData.get("name"),
    servings: Number(formData.get("servings")),
    tags: tags,
    photo_url: e.target.photo.files[0]?.name || "",
    ingredients: ingredients.filter((i) => i.item.trim() !== ""),
    suitableFor: suitableFor,
    calories: Number(formData.get("calories")),
    workflow: formData.get("method"),
    allergens,
  };

  addRecipe(newRecipe);
  navigate("/recipes");
};

  return (
    <div className="main">
      <h1 className="title">Nový recept</h1>
      <img className="form__img" src="./form.webp" alt="" />

      <form id="form" className="form" onSubmit={handleSubmit}>
        <div className="form__item">
          <label htmlFor="name" className="form__label">
            Název
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="form__input"
            defaultValue="Dýňová polévka"
          />
        </div>

        <div className="form__item">
          <label htmlFor="servings" className="form__label">
            Počet porcí
          </label>
          <input
            type="number"
            id="servings"
            name="servings"
            className="form__input"
            defaultValue="4"
          />
        </div>

        <div className="form__item">
          <label className="form__label">Tagy</label>

          <div className="form__checkbox-group">
            {[
              "Snídaně",
              "Svačina",
              "Polévky",
              "Oběd",
              "Večeře",
              "Moučníky",
            ].map((tag) => (
              <label key={tag} className="form__checkbox-label">
                <input
                  type="checkbox"
                  name="tags"
                  value={tag.toLowerCase()}
                  className="form__checkbox"
                />
                {tag}
              </label>
            ))}
          </div>
        </div>

        <div className="form__item">
          <label className="form__label">Vhodné pro</label>
          <div className="form__checkbox-group">
            <label className="form__checkbox-label">
              <input
                type="checkbox"
                name="suitableFor"
                value="veganské"
                className="form__checkbox"
              />
              Veganské
            </label>

            <label className="form__checkbox-label">
              <input
                type="checkbox"
                name="suitableFor"
                value="bez lepku"
                className="form__checkbox"
              />
              Bez lepku
            </label>

            <label className="form__checkbox-label">
              <input
                type="checkbox"
                name="suitableFor"
                value="bez mléka"
                className="form__checkbox"
              />
              Bez mléka
            </label>
          </div>
        </div>


<div className="form__item">
  <label className="form__label">Alergeny</label>
  <div className="form__checkbox-group">
    {[
      "lepek",
      "korýši",
      "vejce",
      "ryby",
      "arašídy",
      "sója",
      "mléko",
      "ořechy",
      "celer",
      "hořčice",
      "sezam",
    ].map((a) => (
      <label key={a} className="form__checkbox-label">
        <input
          type="checkbox"
          name="allergens"   // <- stejné jméno pro všechny checkboxy
          value={a}
          className="form__checkbox"
        />
        {a.charAt(0).toUpperCase() + a.slice(1)}
      </label>
    ))}
  </div>
</div>


        <div className="form__item">
          <label htmlFor="calories" className="form__label">
            Kalorie (kcal na 1 porci)
          </label>
          <input
            type="number"
            id="calories"
            name="calories"
            className="form__input"
            defaultValue="150"
          />
        </div>

        <IngredientInputs
          ingredients={ingredients}
          setIngredients={setIngredients}
        />

        <div className="form__item">
          <label htmlFor="method" className="form__label">
            Postup
          </label>
          <textarea
            id="method"
            name="method"
            className="form__input form__textarea"
            required
            defaultValue="Oloupej a nakrájej dýni a cibuli. Na oleji orestuj cibuli, přidej dýni a zalij vývarem. Vař do změknutí. Rozmixuj dohladka a dochuť solí, pepřem a muškátovým oříškem."
          />
        </div>

        <div className="form__item">
          <label htmlFor="photo" className="form__label">
            Nahrát obrázek
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            className="form__input form__input--file"
          />
          <p className="form__note">Soubor: dynova-polevka.webp</p>
        </div>

        <div className="form__button--div">
          <button type="submit" className="button button--new-recipe">
            Vytvořit
          </button>
        </div>
      </form>
    </div>
  );
};
