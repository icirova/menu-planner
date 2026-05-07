export const HomePageHero = ({
  dateLabel,
  heroImageSrc,
  onScrollToToday,
  timeLabel,
  todayName,
}) => (
  <section
    className="home-page__hero page-hero page-hero--feature"
    aria-label="Dnešní přehled"
    style={{ "--home-hero-image": `url("${heroImageSrc}")` }}
  >
    <div className="home-page__hero-content page-hero__content">
      <p className="page-hero__eyebrow">{dateLabel}</p>
      <h1 className="page-hero__title">{todayName}</h1>
      <p className="page-hero__text">
        Vyber recepty, sestav týdenní plán a měj přehled o nákupu i přípravě.
      </p>
      <div className="page-hero__actions">
        <button
          type="button"
          className="button button--ghost home-page__hero-action"
          onClick={onScrollToToday}
        >
          Dnešní menu
        </button>
      </div>
    </div>

    <div className="home-page__hero-aside page-hero__aside">
      <div className="home-page__hero-time" aria-label={`Aktuální čas ${timeLabel}`}>
        {timeLabel}
      </div>
    </div>
  </section>
);
