import "./style.css";

export const CardHeader = ({ img, day, showTitle = true, titleAboveImage = false }) => {
  return (
    <div className="card__header">
      {titleAboveImage ? (
        <>
          {showTitle && <h1 className="card__title">{day}</h1>}
          {img && <img className="card__image card__image--afterTitle" src={`./image/${img}`} alt="" />}
        </>
      ) : (
        <>
          {img && <img className="card__image" src={`./image/${img}`} alt="" />}
          {showTitle && <h1 className="card__title">{day}</h1>}
        </>
      )}
    </div>
  );
};
