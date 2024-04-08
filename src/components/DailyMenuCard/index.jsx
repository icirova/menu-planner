import "./style.css"

export const DailyMenuCard = ({day, img}) => {
 
 return  <div className="card">
  <img className="card__image" src={`./image/${img}`} alt=""/>
  <h1 className="card__title">{day}</h1>

  <div className="card__content" id="1">
      <div className="card__text">
          <p className="card__subtitle">Snídaně:</p>
          <p className="card__description breakfast"></p>
      </div>

      <div className="card__text">
          <p className="card__subtitle">Svačina:</p>
          <p className="card__description snack"></p>
      </div>

      <div className="card__text">
          <p className="card__subtitle">Oběd:</p>
          <p className="card__description lunch"></p>
      </div>

      <div className="card__text">
          <p className="card__subtitle">Svačina:</p>
          <p className="card__description"></p>
      </div>

      <div className="card__text card__text--dinner">
          <p className="card__subtitle">Večeře:</p>
          <p className="card__description dinner"></p>
      </div>    
  </div>
</div>
}
