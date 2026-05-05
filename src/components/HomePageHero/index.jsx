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
    <div className="home-page__heroContent page-hero__content">
      <p className="page-hero__eyebrow">{dateLabel}</p>
      <h1 className="page-hero__title">{todayName}</h1>
      <p className="page-hero__text">
        Dashboard ti drží pohromadě dnešní menu, nákupní seznam i celý týdenní plán.
      </p>
      <div className="page-hero__actions">
        <button
          type="button"
          className="button button--ghost home-page__heroAction"
          onClick={onScrollToToday}
        >
          Dnešní menu
        </button>
      </div>
    </div>

    <div className="home-page__heroAside page-hero__aside">
      <div className="home-page__heroTime" aria-label={`Aktuální čas ${timeLabel}`}>
        {timeLabel}
      </div>
    </div>
  </section>
);
