import "./style.css";

export const CardHeader = ({ imageSrc, day, showTitle = true, titleAboveImage = false }) => {
  return (
    <div className="card__header">
      {titleAboveImage ? (
        <>
          {showTitle && <h1 className="card__title">{day}</h1>}
          {imageSrc && <img className="card__image card__image--after-title" src={imageSrc} alt="" />}
        </>
      ) : (
        <>
          {imageSrc && <img className="card__image" src={imageSrc} alt="" />}
          {showTitle && <h1 className="card__title">{day}</h1>}
        </>
      )}
    </div>
  );
};
