import { DailyMenuCard } from "../DailyMenuCard/index.jsx";

export const HomePageTodayPanel = ({
  panelRef,
  recipeList,
  todayImageSrc,
  todayIndex,
  todayName,
  weeklyMenu,
  menuDispatch,
}) => (
  <section id="today-overview" ref={panelRef} className="home-page__panel home-page__panel--today">
    <div className="home-page__panel-header">
      <h2>{todayName}</h2>
    </div>

    <div className="home-page__today-card">
      <DailyMenuCard
        day={todayName}
        imageSrc={todayImageSrc}
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
