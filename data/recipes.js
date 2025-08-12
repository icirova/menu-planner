export const recipes = [
    {
    id: 1,
    title: "Dýňová polévka",
    servings: 4,
    tags: ["polévky"],
    photo_urls: ["/imgRecipe/dynova-polevka.webp", "/imgRecipe/dynova-polevka.webp"],
    ingredients: [
      { amount: 500, unit: "g", item: "dýně" },
      { amount: 1, unit: "", item: "cibule" },
      { amount: 2, unit: "lžíce", item: "olej" },
      { amount: 1, unit: "l", item: "zeleninový vývar" },
      { amount: 1, unit: "špetka", item: "sůl" },
      { amount: 1, unit: "špetka", item: "pepř" },
      { amount: 1, unit: "špetka", item: "muškátový oříšek" }
    ],
    allergens: [],
    suitableFor: ["veganské", "bez lepku", "bez mléka"],
    calories: 150,
    workflow: "Oloupej a nakrájej dýni a cibuli. Na oleji orestuj cibuli, přidej dýni a zalij vývarem. Vař do změknutí. Rozmixuj dohladka a dochuť solí, pepřem a muškátovým oříškem."
  },
  {
    id: 2,
    title: "Lívance",
    servings: 4,
    tags: ["snídaně", "svačiny", "moučníky"],
    photo_urls: ["/imgRecipe/livance.webp"],
    ingredients: [
      { amount: 200, unit: "g", item: "hladká mouka" },
      { amount: 300, unit: "ml", item: "mléko" },
      { amount: 1, unit: "", item: "vejce" },
      { amount: 1, unit: "lžička", item: "cukr" },
      { amount: 1, unit: "špetka", item: "sůl" },
      { amount: 1, unit: "lžička", item: "prášek do pečiva" },
      { amount: 2, unit: "lžíce", item: "olej na smažení" }
    ],
    allergens: ["lepek", "mléko", "vejce"],
    suitableFor: [],
    calories: 430,
    workflow: "Smíchej všechny ingredience v hladké těsto. Nech chvíli odpočinout. Na rozpálené pánvi s olejem smaž lívance z obou stran dozlatova."
  },
  {
    id: 3,
    title: "Pizza",
    servings: 4,
    tags: ["obědy", "večeře"],
    photo_urls: ["/imgRecipe/pizza.webp"],
    ingredients: [
      { amount: 250, unit: "g", item: "hladká mouka" },
      { amount: 150, unit: "ml", item: "mléko" },
      { amount: 1, unit: "", item: "vejce" },
      { amount: 2, unit: "lžíce", item: "olej" },
      { amount: 0.5, unit: "kostka", item: "droždí" },
      { amount: 0.5, unit: "lžička", item: "sůl" },
      { amount: 3, unit: "lžíce", item: "rajčatový protlak" },
      { amount: 100, unit: "g", item: "sýr" },
      { amount: 100, unit: "g", item: "šunka nebo zelenina" }
    ],
    allergens: ["lepek", "mléko", "vejce"],
    suitableFor: [],
    calories: 700,
    workflow: "Z droždí, mléka a trochy mouky připrav kvásek. Smíchej s ostatními surovinami a vypracuj těsto. Nech kynout 30–60 min. Rozválej, potřísni protlakem, oblož a peč 15–20 min na 220 °C."
  },
  {
    id: 4,
    title: "Zeleninový salát",
    servings: 4,
    tags: ["obědy", "večeře", "svačiny"],
    photo_urls: ["/imgRecipe/salat.webp"],
    ingredients: [
      { amount: 100, unit: "g", item: "salát (ledový, římský nebo mix)" },
      { amount: 1, unit: "", item: "rajče" },
      { amount: 0.5, unit: "", item: "okurka" },
      { amount: 0.5, unit: "", item: "červená paprika" },
      { amount: 2, unit: "lžíce", item: "olivový olej" },
      { amount: 1, unit: "špetka", item: "sůl" },
      { amount: 1, unit: "špetka", item: "pepř" },
      { amount: 1, unit: "lžička", item: "balzamikový ocet" }
    ],
    allergens: [],
    suitableFor: ["vegetariánské", "bez lepku", "bez mléka"],
    calories: 320,
    workflow: "Zeleninu omyj a nakrájej. Smíchej v míse, přidej olej, dochuť solí, pepřem a případně octem. Podávej čerstvý."
  },
  {
    id: 5,
    title: "Špagety carbonara",
    servings: 4,
    tags: ["obědy", "večeře"],
    photo_urls: ["/imgRecipe/carbonara.webp"],
    ingredients: [
      { amount: 200, unit: "g", item: "špagety" },
      { amount: 100, unit: "g", item: "slanina" },
      { amount: 2, unit: "", item: "žloutky" },
      { amount: 30, unit: "g", item: "parmezán" },
      { amount: 1, unit: "špetka", item: "sůl" },
      { amount: 1, unit: "špetka", item: "pepř" }
    ],
    allergens: ["lepek", "vejce", "mléko"],
    suitableFor: [],
    calories: 600,
    workflow: "Uvař špagety v osolené vodě. Slaninu nakrájej a orestuj dozlatova. V míse smíchej žloutky s nastrouhaným sýrem. Do hotových těstovin přidej slaninu a žloutkovou směs, rychle promíchej. Nevař! Dochuť pepřem a podávej."
  },
   {
    id: 6,
    title: "Boloňské špagety",
    servings: 4,
    tags: ["obědy", "večeře"],
    photo_urls: ["/imgRecipe/bolonske.webp"],
    ingredients: [
      { amount: 200, unit: "g", item: "špagety" },
      { amount: 200, unit: "g", item: "mleté hovězí maso" },
      { amount: 1, unit: "", item: "mrkev" },
      { amount: 1, unit: "", item: "cibule" },
      { amount: 2, unit: "lžíce", item: "rajský protlak" },
      { amount: 2, unit: "lžíce", item: "olej" },
      { amount: 1, unit: "špetka", item: "sůl" },
      { amount: 1, unit: "špetka", item: "pepř" }
    ],
    allergens: ["lepek"],
    suitableFor: [],
    calories: 550,
    workflow: "Nakrájej cibuli a mrkev, osmahni na oleji. Přidej maso a opeč. Vmíchej protlak, osol, opepři. Dus do změknutí masa. Uvař špagety a smíchej s omáčkou. Podávej sypané sýrem, pokud chceš."
  },
  {
    id: 7,
    title: "Makronky",
    servings: 4,
    tags: ["moučníky"],
    photo_urls: ["/imgRecipe/makronky.webp"],
    ingredients: [
      { amount: 100, unit: "g", item: "hladká mouka" },
      { amount: 100, unit: "g", item: "cukr" },
      { amount: 2, unit: "", item: "vejce" },
      { amount: 50, unit: "ml", item: "mléko" },
      { amount: 2, unit: "lžíce", item: "olej" }
    ],
    allergens: ["lepek", "mléko", "vejce"],
    suitableFor: [],
    calories: 350,
    workflow: "Vyšlehej vejce s cukrem, přidej mouku, mléko a olej. Vymíchej hladké těsto. Pomocí sáčku stříkej malé tvary na plech. Peč 10–15 minut na 160 °C. Nech vychladnout a případně slepuj náplní."
  },
  {
    id: 8,
    title: "Smažený řízek",
    servings: 4,
    tags: ["obědy", "večeře"],
    photo_urls: ["/imgRecipe/smazeny-rizek.webp"],
    ingredients: [
      { amount: 500, unit: "g", item: "vepřové maso" },
      { amount: 80, unit: "g", item: "hladká mouka" },
      { amount: 2, unit: "", item: "vejce" },
      { amount: 80, unit: "ml", item: "mléko" },
      { amount: 150, unit: "g", item: "strouhanka" },
      { amount: 200, unit: "ml", item: "olej na smažení" },
      { amount: 1, unit: "lžička", item: "sůl" }
    ],
    allergens: ["lepek", "mléko", "vejce"],
    suitableFor: [],
    calories: 680,
    workflow: "Maso naporcuj, naklepej a osol. Obal v mouce, vejci s mlékem a ve strouhance. Smaž na oleji dozlatova z obou stran. Podávej s bramborem nebo salátem."
  },
  {
    id: 9,
    title: "Přírodní řízek",
    servings: 4,
    tags: ["obědy", "večeře"],
    photo_urls: ["/imgRecipe/rizek-hranolky.webp"],
    ingredients: [
      { amount: 600, unit: "g", item: "kuřecí nebo vepřové maso" },
      { amount: 1, unit: "lžíce", item: "olej" },
      { amount: 1, unit: "lžička", item: "sůl" }
    ],
    allergens: [],
    suitableFor: [],
    calories: "200 - 300",
    workflow: "Maso naporcuj, naklepej, osol a opeč z obou stran na pánvi nebo v troubě."
  }
];

