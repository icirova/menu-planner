import "./style.css"

export const RecipeForm = () => {
  return <div className="main">
    <h1 className="title">Nový recept</h1>
    <img className="form__img" src="./form.webp" alt=""/>

    <form id="form" className="form">
    
    <div className="form__item">
      <label htmlFor="name" className="form__label">
        Název
      </label>
      <input type="text" id="name" name="name" required className="form__input" />
    </div>
    <div className="form__item form__item--2">
      <div>
       
      </div>
      <div>
       
      </div>
    </div>
    <div className="form__item">
      <label htmlFor="ingredients" className="form__label">
        Suroviny
      </label>
      <textarea
        id="ingredients"
        name="ingredients"
        required
        className="form__input form__textarea"
      ></textarea>
    </div>
    <div className="form__item">
      <label htmlFor="method" className="form__label">
        Postup
      </label>
      <textarea
        id="method"
        name="method"
        required
        className="form__input form__textarea"
      ></textarea>
    </div>
    <div className="form__item">
      <label htmlFor="image" className="form__label">
        Nahrát obrázek
      </label>
      <input
        type="file"
        id="photo"
        name="photo"
        placeholder=""
        required
        className="form__input form__input--file"
      />
    </div>
    <div className="form__button--div">
      <button className="button button--new-recipe">Vytvořit</button>
    </div>
  </form>
   
  </div>
}
