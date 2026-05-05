import { DAYS_IN_WEEK } from "../../constants/days";
import { PLANNED_MEAL_KEYS } from "../../constants/mealKeys";

export const HomePageWeekSummaryCard = ({
  completion,
  filledSlots,
  meatLunches,
  occupiedSlotCount,
  repeatedRecipes,
  shoppingSummary,
  sweetMeals,
  veganLunches,
}) => (
  <article className="home-page__summaryCard" aria-label="Souhrn týdne">
    <div className="home-page__summaryHeader">
      <h3>Souhrn týdne</h3>
      <p>Rychlý přehled nad celým plánem a nákupem.</p>
    </div>

    <div className="home-page__summaryGrid">
      <article className="home-page__summaryBox">
        <span className="home-page__summaryValue">{completion} %</span>
        <span className="home-page__summaryLabel">obsazenost slotů</span>
        <span className="home-page__summaryMeta">
          {occupiedSlotCount}/{DAYS_IN_WEEK * PLANNED_MEAL_KEYS.length} slotů
        </span>
      </article>

      <article className="home-page__summaryBox">
        <span className="home-page__summaryValue">{shoppingSummary.totalCount}</span>
        <span className="home-page__summaryLabel">položek v nákupním seznamu</span>
        <span className="home-page__summaryMeta">
          {shoppingSummary.toBuyCount} zbývá, {shoppingSummary.doneCount} koupeno
        </span>
      </article>

      <article className="home-page__summaryBox">
        <span className="home-page__summaryValue">{repeatedRecipes}</span>
        <span className="home-page__summaryLabel">opakující se recepty v průběhu týdne</span>
      </article>

      <article className="home-page__summaryBox">
        <span className="home-page__summaryValue">{sweetMeals}/{filledSlots.length}</span>
        <span className="home-page__summaryLabel">počet sladkých jídel</span>
      </article>

      <article className="home-page__summaryBox">
        <span className="home-page__summaryValue">{meatLunches}:{veganLunches}</span>
        <span className="home-page__summaryLabel">maso vs. vegan obědy</span>
      </article>
    </div>
  </article>
);
