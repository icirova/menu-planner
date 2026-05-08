import { CheckboxGroup } from "../../components/CheckboxGroup/index.jsx";
import { ALLERGEN_OPTIONS, TAG_OPTIONS } from "../../constants/recipeMetadata.js";

export const RecipeClassificationFields = ({ form, suitabilityOptions, toggleSelection }) => (
  <section className="recipe-form-page__panel">
    <div className="recipe-form-page__section-header">
      <h2>Zařazení</h2>
    </div>

    <div className="recipe-form-page__field-grid recipe-form-page__field-grid--classification">
      <CheckboxGroup
        legend="Tagy"
        name="tags"
        options={TAG_OPTIONS}
        selectedValues={form.selectedTags}
        onToggle={(value) => toggleSelection("selectedTags", value)}
      />

      <CheckboxGroup
        legend="Vhodné pro"
        name="suitableFor"
        options={suitabilityOptions}
        selectedValues={form.selectedSuitableFor}
        onToggle={(value) => toggleSelection("selectedSuitableFor", value)}
      />

      <CheckboxGroup
        legend="Alergeny"
        name="allergens"
        options={ALLERGEN_OPTIONS}
        selectedValues={form.selectedAllergens}
        onToggle={(value) => toggleSelection("selectedAllergens", value)}
      />
    </div>
  </section>
);
