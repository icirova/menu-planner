import { ShoppingList } from "../ShoppingList/index.jsx";

export const HomePageShoppingPanel = ({ weeklyMenu, recipeList, onChange }) => (
  <section className="home-page__panel home-page__panel--shopping">
    <div className="home-page__panel-header">
      <h2>Nákupní seznam</h2>
    </div>

    <ShoppingList
      value={weeklyMenu.shopping}
      week={weeklyMenu.week}
      recipes={recipeList}
      onChange={onChange}
      showTitle={false}
    />
  </section>
);
