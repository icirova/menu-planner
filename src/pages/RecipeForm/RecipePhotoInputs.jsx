import { resolveImageSrc } from "../../utils/resolveImageSrc.js";

export const RecipePhotoInputs = ({
  fileInputRef,
  handlePhotosChange,
  photos,
  removePhotoAt,
}) => (
  <section className="recipe-form-page__panel">
    <div className="recipe-form-page__section-header">
      <h2>Fotogalerie</h2>
    </div>

    <div className="recipe-form-page__subsection form__item form__item--photos">
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

      <div className="recipe-form-page__upload-row">
        <button
          type="button"
          className="button button--add button--file"
          onClick={() => fileInputRef.current?.click()}
          aria-controls="photos"
          aria-label="Vybrat obrázky"
        >
          Přidat fotky
        </button>

        <p id="photos-note" className="form__note">
          Vyber jednu či více fotek. První bude hlavička.
        </p>
      </div>

      {photos.length > 0 && (
        <div className="form__filenames" aria-live="polite">
          {photos.map((p, i) => (
            <div key={`${p.name}-${i}`} className="form__filename">
              {i === 0 ? "Obálka: " : ""}{p.name}
            </div>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <div className="form__previews">
          {photos.map((p, i) => (
            <div key={`${p.url}-${i}`} className="form__preview-wrap">
              <img
                src={resolveImageSrc(p.url)}
                alt={`Náhled ${i + 1}`}
                className={`form__preview ${i === 0 ? "form__preview--cover" : ""}`}
              />
              <div className="form__preview-meta">
                {i === 0 ? "Obálka (hlavička)" : `Galerie #${i}`}
                <button
                  type="button"
                  className="button--remove-control form__preview-remove"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    removePhotoAt(i);
                  }}
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
  </section>
);
