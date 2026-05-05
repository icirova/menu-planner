import { DailyMenuCard } from "../DailyMenuCard";

export const HomePageTodayPanel = ({
  panelRef,
  recipeList,
  todayImageFile,
  todayIndex,
  todayName,
  weeklyMenu,
  menuDispatch,
}) => (
  <section
    id="today-overview"
    ref={panelRef}
    className="home-page__panel home-page__panel--today"
  >
    <div className="home-page__panelHeader">
      <h2>{todayName}</h2>
      <p>Rychlý denní přehled.</p>
    </div>

    <div className="home-page__todayCard">
      <DailyMenuCard
        day={todayName}
        img={todayImageFile}
        dayIndex={todayIndex}
        data={weeklyMenu.week[todayIndex]}
        dispatch={menuDispatch}
        recipes={recipeList}
        variant="overview"
        showDayReset={false}
        showHeaderTitle={false}
        hideEmptySlots
        readOnly
        showDetailLink={false}
      />
    </div>
  </section>
);
