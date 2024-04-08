import "./style.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { recipes } from "../../../data/recipes";
import { useState, useEffect } from "react";

export const RecipeDetail = () => {

    const {id} = useParams();
    const [recipeDetail, setRecipeDetail] = useState(null);
   
    useEffect(() => {
        const foundRecipe = recipes.find(recipe => recipe.id === parseInt(id))

        if (foundRecipe) {
            console.log(foundRecipe)
            setRecipeDetail(foundRecipe)
        } else {
            console.log("Recept nebyl nalezen.")
        }
    }, [id])

    return (
        <div className="main">
            {recipeDetail ? (
                <>
                    <h1 className="title">{recipeDetail.title}</h1>
                    <div className="recipe-detail">
                        <div className="recipe-detail__img">
                            <img src={`../imgRecipe/${recipeDetail.photo_url}`} alt="" className="recipe-detail__image" />
                        </div>

                        <div className="recipe-detail__text">
                            <h2 className="recipe-detail__subtitle">Suroviny:</h2>
                            <p className="recipe-detail__description">{recipeDetail.ingredients.join(", ")}</p>
                            <h2 className="recipe-detail__subtitle">Postup:</h2>
                            <p className="recipe-detail__description">{recipeDetail.workflow}</p>
                        </div>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
            <Link to="/recipes" className="menu__item">Zpět</Link>
        </div>
    )
}
