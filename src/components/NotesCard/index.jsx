import "./style.css"

export const NotesCard = () => {
  return<div className="card card--notes">
  <img className="card__image" src="./notes.webp" alt=""/>
  <h1 className="card__title">poznámky</h1>
  <div className="card__content">
      <p className="card__description card__description--notes"></p>
  </div>
</div>
}
