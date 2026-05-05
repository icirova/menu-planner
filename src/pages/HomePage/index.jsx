import "./style.css";
import { useRef } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { DailyMenuCards } from "../../components/DailyMenuCards";
import { HomeMoodCard } from "../../components/HomeMoodCard";
import { HomePageHero } from "../../components/HomePageHero";
import { HomePageShoppingPanel } from "../../components/HomePageShoppingPanel";
import { HomePageTodayPanel } from "../../components/HomePageTodayPanel";
import { HomePageWeekSummaryCard } from "../../components/HomePageWeekSummaryCard";
import { WeeklyTasksPanel } from "../../components/WeeklyTasksPanel";
import { useHomePageHero } from "../../hooks/useHomePageHero";
import { useHomePageSummary } from "../../hooks/useHomePageSummary";

export const HomePage = () => {
  const todayOverviewRef = useRef(null);
  const { recipeList, weeklyMenu, menuDispatch } = useOutletContext();
  const { dateLabel, heroImageSrc, timeLabel, todayImageFile, todayIndex, todayName } = useHomePageHero();
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

        <section className="home-page__panel home-page__panel--weeklyTasks">
          <div className="home-page__panelHeader">
            <h2>Úkoly na týden</h2>
            <p>Úkoly a připomínky k naplánovaným receptům.</p>
          </div>

          <div className="home-page__weeklyTasks">
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
          <div className="home-page__topGrid">
            <HomePageTodayPanel
              panelRef={todayOverviewRef}
              recipeList={recipeList}
              todayImageFile={todayImageFile}
              todayIndex={todayIndex}
              todayName={todayName}
              weeklyMenu={weeklyMenu}
              menuDispatch={menuDispatch}
            />

            <HomePageShoppingPanel
              shoppingSummary={shoppingSummary}
              weeklyMenu={weeklyMenu}
              recipeList={recipeList}
              onChange={(value) => menuDispatch({ type: "UPDATE_SHOPPING", value })}
            />
          </div>
        </section>

        <section className="home-page__panel">
          <div className="home-page__panelHeader home-page__panelHeader--withAction">
            <div>
              <h2>Kompletní plán</h2>
              <p>Celý týden pohromadě, s rychlým přehledem receptů a surovin k nákupu.</p>
            </div>
            <Link to="/planner" className="button button--ghost home-page__panelAction">
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
              trailingContent={(
                <>
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
                </>
              )}
            />
          </div>
        </section>
      </div>
    </section>
  );
};
