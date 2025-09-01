import "./style.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import { IngredientInputs } from "../../components/IngredientInputs/index";
import { useState, useEffect, useRef } from "react";

export const RecipeForm = () => {
  const navigate = useNavigate();
  const { addRecipe } = useOutletContext();

  const [ingredients, setIngredients] = useState([]);
  const [photos, setPhotos] = useState([]); // { url: string, name: string }[]

  const fileInputRef = useRef(null)

  // drž aktuální photos v ref kvůli bezpečnému cleanupu při unmountu
  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  // zruš zbývající blob URL při odchodu ze stránky (unmount)
  useEffect(() => {
    return () => {
      photosRef.current.forEach((p) => {
        try { URL.revokeObjectURL(p.url); } catch {}
      });
    };
  }, []);

  const handlePhotosChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // vytvoř položky {url, name} pro každý vybraný soubor
    const newItems = files.map((f) => ({
      url: URL.createObjectURL(f),
      name: f.name,
    }));
    setPhotos((prev) => [...prev, ...newItems]);

    // vyčisti input (ať můžeš vybrat stejné soubory znovu, pokud chceš)
    e.target.value = "";
  };

  const removePhotoAt = (index) => {
    setPhotos((prev) => {
      try { URL.revokeObjectURL(prev[index].url); } catch {}
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const tags = formData.getAll("tags");
    const suitableFor = formData.getAll("suitableFor");
    const allergens = formData.getAll("allergens");

    const newRecipe = {
      id: Date.now(),
      title: formData.get("name"),
      servings: Number(formData.get("servings")),
      tags,
      photo_urls: photos.map((p) => p.url), // první = cover
      ingredients: ingredients.filter((i) => i.item.trim() !== ""),
      suitableFor,
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
          <label htmlFor="name" className="form__label">Název</label>
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
          <label htmlFor="servings" className="form__label">Počet porcí</label>
          <input
            type="number"
            id="servings"
            name="servings"
            className="form__input"
            defaultValue="4"
          />
        </div>

        {/* Tagy */}
        <div className="form__item">
          <fieldset className="form__fieldset">
            <legend className="form__label">Tagy</legend>
            <div className="form__checkbox-group">
              {["Snídaně","Svačina","Polévky","Oběd","Večeře","Moučníky"].map((tag) => (
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
          </fieldset>
        </div>

        {/* Vhodné pro */}
        <div className="form__item">
          <fieldset className="form__fieldset">
            <legend className="form__label">Vhodné pro</legend>
            <div className="form__checkbox-group">
              <label className="form__checkbox-label">
                <input type="checkbox" name="suitableFor" value="veganské" className="form__checkbox" />
                Veganské
              </label>
              <label className="form__checkbox-label">
                <input type="checkbox" name="suitableFor" value="bez lepku" className="form__checkbox" />
                Bez lepku
              </label>
              <label className="form__checkbox-label">
                <input type="checkbox" name="suitableFor" value="bez mléka" className="form__checkbox" />
                Bez mléka
              </label>
            </div>
          </fieldset>
        </div>

        {/* Alergeny */}
        <div className="form__item">
          <fieldset className="form__fieldset">
            <legend className="form__label">Alergeny</legend>
            <div className="form__checkbox-group">
              {["lepek","korýši","vejce","ryby","arašídy","sója","mléko","ořechy","celer","hořčice","sezam"].map((a) => (
                <label key={a} className="form__checkbox-label">
                  <input type="checkbox" name="allergens" value={a} className="form__checkbox" />
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="form__item">
          <label htmlFor="calories" className="form__label">Kalorie (kcal na 1 porci)</label>
          <input
            type="number"
            id="calories"
            name="calories"
            className="form__input"
            defaultValue="150"
          />
        </div>

        <IngredientInputs ingredients={ingredients} setIngredients={setIngredients} />

        {/* Upload fotek */}
    <div className="form__item">
  <label htmlFor="photos" className="form__label">Nahrát obrázky</label>

  <input
    type="file"
    id="photos"
    name="photos"
    accept="image/*"
    multiple
    onChange={handlePhotosChange}
    className="visually-hidden"
    aria-describedby="photos-note"
    ref={fileInputRef}
  />

  <button
    type="button"
    className="button button--file"
    onClick={() => fileInputRef.current?.click()}
    aria-controls="photos"
    aria-label="Vybrat obrázky"
  >
    +
  </button>

  {photos.length > 0 ? (
    <div className="form__filenames" aria-live="polite">
      {photos.map((p, i) => (
        <div key={`${p.name}-${i}`} className="form__filename">
          {i === 0 ? "Obálka: " : ""}{p.name}
        </div>
      ))}
    </div>
  ) : (
    <p id="photos-note" className="form__note">
      Vyber jednu či více fotek. První bude hlavička.
    </p>
  )}

  {photos.length > 0 && (
    <div className="form__previews">
      {photos.map((p, i) => (
        <div key={`${p.url}-${i}`} className="form__preview-wrap">
          <img
            src={p.url}
            alt={`Náhled ${i + 1}`}
            className={`form__preview ${i === 0 ? "form__preview--cover" : ""}`}
          />
          <div className="form__preview-meta">
            {i === 0 ? "Obálka (hlavička)" : `Galerie #${i}`}
            <button
              type="button"
              className="button button--icon button--danger form__preview-remove"
              onClick={() => removePhotoAt(i)}
              aria-label={`Odebrat náhled ${i + 1}`}
              title="Odebrat náhled"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

        <div className="form__button--div">
          <button type="submit" className="button button--new-recipe">Vytvořit</button>
        </div>
      </form>
    </div>
  );
};
