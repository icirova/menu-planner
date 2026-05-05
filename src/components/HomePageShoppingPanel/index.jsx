import { ShoppingList } from "../ShoppingList";

export const HomePageShoppingPanel = ({
  shoppingSummary,
  weeklyMenu,
  recipeList,
  onChange,
}) => (
  <section className="home-page__panel home-page__panel--shopping">
    <div className="home-page__panelHeader">
      <h2>Nákupní seznam</h2>
      <p className={!shoppingSummary.toBuyCount ? "home-page__panelText--empty" : ""}>
        {shoppingSummary.toBuyCount
          ? `${shoppingSummary.toBuyCount} položek čeká na nákup.`
          : "Zatím není potřeba nic dokupovat."}
      </p>
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
