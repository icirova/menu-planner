import "./style.css";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { IngredientInputs } from "../../components/IngredientInputs/index";
import { useEffect, useRef, useState } from "react";

const TAG_OPTIONS = [
  { label: "Snídaně", value: "snídaně" },
  { label: "Svačina", value: "svačiny" },
  { label: "Polévky", value: "polévky" },
  { label: "Oběd", value: "obědy" },
  { label: "Večeře", value: "večeře" },
  { label: "Moučníky", value: "moučníky" },
];

export const RecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipeList, addRecipe, updateRecipe } = useOutletContext();
  const recipeToEdit = id ? recipeList.find((recipe) => recipe.id === Number(id)) : null;
  const isEditMode = Boolean(id);
  const isEditableRecipe = !isEditMode || recipeToEdit?.source === "custom";

  const [name, setName] = useState("Název receptu");
  const [servings, setServings] = useState("4");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedSuitableFor, setSelectedSuitableFor] = useState([]);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [calories, setCalories] = useState("0");
  const [method, setMethod] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [photos, setPhotos] = useState([]); // { url: string, name: string }[]

  const fileInputRef = useRef(null);

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const handlePhotosChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const newItems = await Promise.all(
        files.map(async (file) => ({
          url: await readFileAsDataUrl(file),
          name: file.name,
        })),
      );
      setPhotos((prev) => [...prev, ...newItems]);
    } catch (error) {
      console.error("Nepodařilo se načíst obrázek.", error);
    }

    e.target.value = "";
  };

  useEffect(() => {
    if (!isEditMode) {
      setName("Název receptu");
      setServings("4");
      setSelectedTags([]);
      setSelectedSuitableFor([]);
      setSelectedAllergens([]);
      setCalories("0");
      setMethod("");
      setIngredients([]);
      setPhotos([]);
      return;
    }

    if (!recipeToEdit || recipeToEdit.source !== "custom") return;

    setName(recipeToEdit.title ?? "");
    setServings(String(recipeToEdit.servings ?? 4));
    setSelectedTags(recipeToEdit.tags ?? []);
    setSelectedSuitableFor(recipeToEdit.suitableFor ?? []);
    setSelectedAllergens(recipeToEdit.allergens ?? []);
    setCalories(String(recipeToEdit.calories ?? 0));
    setMethod(recipeToEdit.workflow ?? "");
    setIngredients(recipeToEdit.ingredients ?? []);
    setPhotos(
      (recipeToEdit.photo_urls ?? []).map((url, index) => ({
        url,
        name: `obrazek-${index + 1}`,
      })),
    );
  }, [isEditMode, recipeToEdit]);

  const toggleSelection = (value, setter) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const removePhotoAt = (index) => {
    if (!window.confirm("Opravdu chceš odebrat tento obrázek?")) return;
    setPhotos((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRecipe = {
      id: recipeToEdit?.id ?? Date.now(),
      title: name.trim(),
      servings: Number(servings),
      tags: selectedTags,
      photo_urls: photos.map((p) => p.url), // první = cover
      ingredients: ingredients.filter((i) => i.item.trim() !== ""),
      suitableFor: selectedSuitableFor,
      calories: Number(calories),
      workflow: method.trim(),
      allergens: selectedAllergens,
    };

    if (isEditMode) {
      updateRecipe(newRecipe);
      navigate(`/recipe-detail/${newRecipe.id}`);
      return;
    }

    addRecipe(newRecipe);
    navigate("/recipes");
  };

  if (isEditMode && !isEditableRecipe) {
    return (
      <div className="main">
        <h1 className="title">Úprava receptu</h1>
        <p>Tento recept nelze upravovat, protože je součástí vestavěného katalogu.</p>
        <Link to="/recipes" className="menu__item button">Zpět</Link>
      </div>
    );
  }

  return (
    <div className="main">
      <h1 className="title">{isEditMode ? "Upravit recept" : "Nový recept"}</h1>
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form__item">
          <label htmlFor="servings" className="form__label">Počet porcí</label>
          <input
            type="number"
            id="servings"
            name="servings"
            className="form__input"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
          />
        </div>

        {/* Tagy */}
        <div className="form__item">
          <fieldset className="form__fieldset">
            <legend className="form__label">Tagy</legend>
            <div className="form__checkbox-group">
              {TAG_OPTIONS.map((tag) => (
                <label key={tag.value} className="form__checkbox-label">
                  <input
                    type="checkbox"
                    name="tags"
                    value={tag.value}
                    className="form__checkbox"
                    checked={selectedTags.includes(tag.value)}
                    onChange={() => toggleSelection(tag.value, setSelectedTags)}
                  />
                  {tag.label}
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
                <input
                  type="checkbox"
                  name="suitableFor"
                  value="veganské"
                  className="form__checkbox"
                  checked={selectedSuitableFor.includes("veganské")}
                  onChange={() => toggleSelection("veganské", setSelectedSuitableFor)}
                />
                Veganské
              </label>
              <label className="form__checkbox-label">
                <input
                  type="checkbox"
                  name="suitableFor"
                  value="bez lepku"
                  className="form__checkbox"
                  checked={selectedSuitableFor.includes("bez lepku")}
                  onChange={() => toggleSelection("bez lepku", setSelectedSuitableFor)}
                />
                Bez lepku
              </label>
              <label className="form__checkbox-label">
                <input
                  type="checkbox"
                  name="suitableFor"
                  value="bez mléka"
                  className="form__checkbox"
                  checked={selectedSuitableFor.includes("bez mléka")}
                  onChange={() => toggleSelection("bez mléka", setSelectedSuitableFor)}
                />
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
                  <input
                    type="checkbox"
                    name="allergens"
                    value={a}
                    className="form__checkbox"
                    checked={selectedAllergens.includes(a)}
                    onChange={() => toggleSelection(a, setSelectedAllergens)}
                  />
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Kalorie */}
        <div className="form__item">
          <label htmlFor="calories" className="form__label">Kalorie (kcal na 1 porci)</label>
          <input
            type="number"
            id="calories"
            name="calories"
            className="form__input"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
        </div>

        <div className="form__item">
          <label htmlFor="method" className="form__label">Postup</label>
          <textarea
            id="method"
            name="method"
            className="form__input form__textarea"
            placeholder="Popiš postup přípravy"
            required
            value={method}
            onChange={(e) => setMethod(e.target.value)}
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
          <button type="submit" className="button button--new-recipe">
            {isEditMode ? "Uložit změny" : "Vytvořit"}
          </button>
        </div>
      </form>
    </div>
  );
};
