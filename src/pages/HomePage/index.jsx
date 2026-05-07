import "./style.css";
import { useRef } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { DailyMenuCards } from "../../components/DailyMenuCards/index.jsx";
import { HomeMoodCard } from "../../components/HomeMoodCard/index.jsx";
import { HomePageHero } from "../../components/HomePageHero/index.jsx";
import { HomePageShoppingPanel } from "../../components/HomePageShoppingPanel/index.jsx";
import { HomePageTodayPanel } from "../../components/HomePageTodayPanel/index.jsx";
import { HomePageWeekSummaryCard } from "../../components/HomePageWeekSummaryCard/index.jsx";
import { PantryCard } from "../../components/PantryCard/index.jsx";
import { WeeklyTasksPanel } from "../../components/WeeklyTasksPanel/index.jsx";
import { useHomePageHero } from "../../hooks/useHomePageHero.js";
import { useHomePageSummary } from "../../hooks/useHomePageSummary.js";

export const HomePage = () => {
  const todayOverviewRef = useRef(null);
  const { recipeList, weeklyMenu, menuDispatch } = useOutletContext();
  const { dateLabel, heroImageSrc, timeLabel, todayImageSrc, todayIndex, todayName } = useHomePageHero();
  const {
    completion,
    filledSlots,
    meatLunches,
    occupiedSlotCount,
    repeatedRecipes,
    shoppingSummary,
    sweetMeals,
    veganLunches,
  } = useHomePageSummary(weeklyMenu, recipeList);
  const handleHeroActionClick = () => {
    todayOverviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="home-page">
      <div className="home-page__sheet">
        <HomePageHero
          dateLabel={dateLabel}
          heroImageSrc={heroImageSrc}
          onScrollToToday={handleHeroActionClick}
          timeLabel={timeLabel}
          todayName={todayName}
        />

        <section className="home-page__panel home-page__panel--weekly-tasks">
          <div className="home-page__panel-header">
            <h2>Úkoly na týden</h2>
          </div>

          <div className="home-page__weekly-tasks">
            <WeeklyTasksPanel
              value={weeklyMenu.tasks}
              week={weeklyMenu.week}
              recipes={recipeList}
              prepDone={weeklyMenu.prepDone}
              extraDone={weeklyMenu.extraDone}
              onTogglePrepDone={(id) => menuDispatch({ type: "TOGGLE_PREP_DONE", id })}
              onToggleExtraDone={(id) => menuDispatch({ type: "TOGGLE_EXTRA_DONE", id })}
              onAddNote={(text) => menuDispatch({ type: "ADD_TASK_ITEM", text })}
              onToggleNote={(id) => menuDispatch({ type: "TOGGLE_TASK_ITEM", id })}
              onRemoveNote={(id) => menuDispatch({ type: "REMOVE_TASK_ITEM", id })}
            />
          </div>
        </section>

        <section className="home-page__overview">
          <div className="home-page__top-grid">
            <HomePageTodayPanel
              panelRef={todayOverviewRef}
              recipeList={recipeList}
              todayImageSrc={todayImageSrc}
              todayIndex={todayIndex}
              todayName={todayName}
              weeklyMenu={weeklyMenu}
              menuDispatch={menuDispatch}
            />

            <HomePageShoppingPanel
              weeklyMenu={weeklyMenu}
              recipeList={recipeList}
              onChange={(value) => menuDispatch({ type: "UPDATE_SHOPPING", value })}
            />
          </div>
        </section>

        <section className="home-page__panel">
          <div className="home-page__panel-header home-page__panel-header--with-action">
            <div>
              <h2>Kompletní plán</h2>
            </div>
            <Link to="/planner" className="button button--ghost home-page__panel-action">
              Otevřít plánovač
            </Link>
          </div>

          <div className="home-page__cards">
            <DailyMenuCards
              recipes={recipeList}
              state={weeklyMenu}
              dispatch={menuDispatch}
              variant="overview"
              showDayReset={false}
              dailyCardProps={{
                readOnly: true,
                showShoppingSection: true,
                titleAboveImage: true,
              }}
              trailingContent={<PantryCard />}
            />
          </div>
        </section>

        <section className="home-page__panel">
          <div className="home-page__panel-header">
            <h2>Týden v kostce</h2>
          </div>

          <div className="home-page__week-insights-grid">
            <HomePageWeekSummaryCard
              completion={completion}
              filledSlots={filledSlots}
              meatLunches={meatLunches}
              occupiedSlotCount={occupiedSlotCount}
              repeatedRecipes={repeatedRecipes}
              shoppingSummary={shoppingSummary}
              sweetMeals={sweetMeals}
              veganLunches={veganLunches}
            />

            <HomeMoodCard />
          </div>
        </section>
      </div>
    </section>
  );
};
