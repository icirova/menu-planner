import { useState } from "react";
import "./style.css";

const customMoodImages = Object.values(
  import.meta.glob("../../assets/home-mood/*.{png,jpg,jpeg,webp,avif}", {
    eager: true,
    import: "default",
  }),
);

const fallbackImages = [
  "/imgRecipe/domaci-testoviny.webp",
  "/imgRecipe/pizza.webp",
  "/imgRecipe/ramen.webp",
  "/imgRecipe/bananove-livance.webp",
  "/imgRecipe/bun-cha.webp",
  "/imgRecipe/borsc.webp",
  "/imgRecipe/tofu-burger.webp",
  "/imgRecipe/naparovana-babovka.webp",
];

const moods = [
  "Když chybí energie, nastupují těstoviny.",
  "Dneska vaří někdo jiný. Třeba moje budoucí já.",
  "Vaříš znovu. To je od tebe podezřele zodpovědné.",
  "Jídlo je hotové tehdy, když přestaneš experimentovat a začneš servírovat.",
  "Chleba to jistí.",
  "Každý hrnec, který neumřel připálením, je vítěz.",
  "Večeře nemusí být ikonická. Stačí, že existuje.",
  "Kdo naplánoval jídlo dopředu, porazil budoucí chaos.",
  "Nejdřív kafe. Pak vaření.",
  "Plotna zapnutá. Morálka překvapivě také.",
  "Neřeš. Jez",
  "Podporuji lokální gastro scénu. Z gauče.",
  "Vaření je fajn. Ale dovoz je rychlejší.",
  "Dnes šetřím energii. Na důležitější věci.",
  "Otevři lednici a doufej.",
  "Dnešní menu: něco mezi improvizací a osobním růstem.",
];

const pickRandomItem = (items) => items[Math.floor(Math.random() * items.length)];

export const HomeMoodCard = () => {
  const [mood] = useState(() => pickRandomItem(moods));
  const [image] = useState(() => {
    const images = customMoodImages.length > 0 ? customMoodImages : fallbackImages;
    return pickRandomItem(images);
  });

  return (
    <article
      className="home-mood-card"
      aria-label="Kuchyňská nálada"
      style={{ "--home-mood-image": `url("${image}")` }}
    >
      <div className="home-mood-card__overlay">
        <p className="home-mood-card__text">{mood}</p>
      </div>
    </article>
  );
};
