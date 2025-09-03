import "./style.css";

export const CardHeader = ({ img, day }) => {
    return (
        <div className="card__header">
            {img && <img className="card__image" src={`./image/${img}`} alt="" />}
            <h1 className="card__title">{day}</h1>
        </div>
    );
};
