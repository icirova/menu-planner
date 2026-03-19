import "./style.css"

export const AllergenTags = ({ allergens }) => {
  if (!allergens || allergens.length === 0) return null;

  return (
    <>
      {/* <h2 className="recipe-detail__subtitle">Alergeny:</h2> */}
      <div className="recipe-detail__allergen-tags">
        {allergens.map((a, idx) => (
          <span key={idx} className="recipe-detail__tag--allergen">
            {a}
          </span>
        ))}
      </div>
    </>
  );
};
