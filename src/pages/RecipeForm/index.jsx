import "./style.css"

export const RecipeForm = () => {
  return <div className="main">
    <h1 className="title">Nový recept</h1>
    <img className="form__img" src="./pages/RecipeForm/form.webp" alt=""/>

    <form id="form" class="form">
    
    <div class="form__item">
      <label for="name" class="form__label">
        Název
      </label>
      <input type="text" id="name" name="name" required class="form__input" />
    </div>
    <div class="form__item form__item--2">
      <div>
       
      </div>
      <div>
       
      </div>
    </div>
    <div class="form__item">
      <label for="ingredients" class="form__label">
        Suroviny
      </label>
      <textarea
        id="ingredients"
        name="ingredients"
        required
        class="form__input form__textarea"
      ></textarea>
    </div>
    <div class="form__item">
      <label for="method" class="form__label">
        Postup
      </label>
      <textarea
        id="method"
        name="method"
        required
        class="form__input form__textarea"
      ></textarea>
    </div>
    <div class="form__item">
      <label for="image" class="form__label">
        Nahrát obrázek
      </label>
      <input
        type="file"
        id="photo"
        name="photo"
        placeholder=""
        required
        class="form__input form__input--file"
      />
    </div>
    <div class="form__button--div">
      <button class="button button--new-recipe">Vytvořit</button>
    </div>
  </form>
   
  </div>
}
