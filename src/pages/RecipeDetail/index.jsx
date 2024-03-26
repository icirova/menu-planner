import { Link } from "react-router-dom"
import "./style.css"

export const RecipeDetail = () => {
  return <div className="main">
    <h1 className="title">Pizza</h1>
    <div className="recipe-detail">
        <div className="recipe-detail__img">
            <img src="./components/RecipeCard/img/pizza.webp" alt="" className="recipe-detail__image" />
        </div>

        <div className="recipe-detail__text">
            <h2 className="recipe-detail__subtitle">Suroviny:</h2>
            <p className="recipe-detail__description">hladká mouka, olivový olej</p>
            <h2 className="recipe-detail__subtitle">Postup:</h2>
            <p className="recipe-detail__description">Nejprve si připrav těsto, potom omáčku.</p>
        </div>
    </div>
    
    <Link to="/recipes" className="menu__item">Zpět</Link>
    
</div>
}
