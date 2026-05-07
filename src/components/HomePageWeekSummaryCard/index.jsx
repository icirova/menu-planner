import { DAYS_IN_WEEK } from "../../constants/days.js";
import { PLANNED_MEAL_KEYS } from "../../constants/mealKeys.js";

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
  <article className="home-page__summary-card" aria-label="Souhrn týdne">
    <div className="home-page__summary-content">
      <div className="home-page__summary-grid">
        <article className="home-page__summary-box">
          <span className="home-page__summary-value">{completion} %</span>
          <span className="home-page__summary-label">obsazenost slotů</span>
          <span className="home-page__summary-meta">
            {occupiedSlotCount}/{DAYS_IN_WEEK * PLANNED_MEAL_KEYS.length} slotů
          </span>
        </article>

        <article className="home-page__summary-box">
          <span className="home-page__summary-value">{shoppingSummary.totalCount}</span>
          <span className="home-page__summary-label">položek v nákupním seznamu</span>
          <span className="home-page__summary-meta">
            {shoppingSummary.toBuyCount} zbývá, {shoppingSummary.doneCount} koupeno
          </span>
        </article>

        <article className="home-page__summary-box">
          <span className="home-page__summary-value">{repeatedRecipes}</span>
          <span className="home-page__summary-label">opakující se recepty v průběhu týdne</span>
        </article>

        <article className="home-page__summary-box">
          <span className="home-page__summary-value">{sweetMeals}/{filledSlots.length}</span>
          <span className="home-page__summary-label">počet sladkých jídel</span>
        </article>

        <article className="home-page__summary-box">
          <span className="home-page__summary-value">{meatLunches}:{veganLunches}</span>
          <span className="home-page__summary-label">maso vs. vegan obědy</span>
        </article>
      </div>
    </div>
  </article>
);
