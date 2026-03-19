import "./style.css"


export const SuitabilityTags = ({ suitability }) => {
  if (!suitability || suitability.length === 0) return null;

  return (
    <>
      {/* <h2 className="recipe-detail__subtitle">Vhodné pro:</h2> */}
      <div className="recipe-detail__suitable-tags">
        {suitability.map((s, idx) => (
          <span key={idx} className="recipe-detail__tag">
            {s}
          </span>
        ))}
      </div>
    </>
  );
};
