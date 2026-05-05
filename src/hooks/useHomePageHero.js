import { useEffect, useMemo, useState } from "react";
import { DAY_HERO_IMAGES, DAY_IMAGE_FILES } from "../constants/dayImages";
import { DAYS, DAYS_IN_WEEK } from "../constants/days";

const SUNDAY_INDEX = 0;
const LAST_DAY_INDEX = DAYS_IN_WEEK - 1;
const CLOCK_REFRESH_INTERVAL_MS = 30_000;

const getTodayIndex = () => {
  const today = new Date().getDay();
  return today === SUNDAY_INDEX ? LAST_DAY_INDEX : today - 1;
};

const formatDateLabel = (date) =>
  new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "long",
  }).format(date);

const formatTimeLabel = (date) =>
  new Intl.DateTimeFormat("cs-CZ", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

export const useHomePageHero = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, CLOCK_REFRESH_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  return useMemo(() => {
    const todayIndex = getTodayIndex();

    return {
      dateLabel: formatDateLabel(now),
      heroImageSrc: DAY_HERO_IMAGES[todayIndex],
      timeLabel: formatTimeLabel(now),
      todayImageFile: DAY_IMAGE_FILES[todayIndex],
      todayIndex,
      todayName: DAYS[todayIndex],
    };
  }, [now]);
};
