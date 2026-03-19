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
    suitableFor: ["veganské", "bez lepku"],
    calories: 150,
    workflow: "Oloupej a nakrájej dýni a cibuli. Na oleji orestuj cibuli, přidej dýni a zalij vývarem. Vař do změknutí. Rozmixuj dohladka a dochuť."
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
    workflow: "Smíchej těsto, nech chvilku odpočinout a smaž dozlatova."
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
    workflow: "Z kvásku a surovin vypracuj těsto, nech kynout, oblož a peč 15–20 min na 220 °C."
  },
  {
    id: 4,
    title: "Zeleninový salát",
    servings: 4,
    tags: ["obědy", "večeře", "svačiny"],
    photo_urls: ["/imgRecipe/salat.webp"],
    ingredients: [
      { amount: 100, unit: "g", item: "salát (ledový/římský/mix)" },
      { amount: 1, unit: "", item: "rajče" },
      { amount: 0.5, unit: "", item: "okurka" },
      { amount: 0.5, unit: "", item: "červená paprika" },
      { amount: 2, unit: "lžíce", item: "olivový olej" },
      { amount: 1, unit: "špetka", item: "sůl" },
      { amount: 1, unit: "špetka", item: "pepř" },
      { amount: 1, unit: "lžička", item: "balzamikový ocet" }
    ],
    allergens: [],
    suitableFor: ["veganské", "bez lepku"],
    calories: 320,
    workflow: "Nakrájej zeleninu, promíchej s olejem a dochuť."
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
    workflow: "Uvař špagety, smíchej se slaninou a žloutkovou směsí mimo plotnu."
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
    workflow: "Orestuj zeleninu, přidej maso, protlak, poduš a smíchej s těstovinami."
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
    workflow: "Vyšlehej vejce s cukrem, přidej mouku, mléko, olej a upeč malé tvary."
  },
  {
    id: 8,
    title: "Řízek smažený",
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
    workflow: "Obal a usmaž dozlatova."
  },
  {
    id: 9,
    title: "Řízek přírodní",
    servings: 4,
    tags: ["obědy", "večeře"],
    photo_urls: ["/imgRecipe/rizek-prirodni.webp"],
    ingredients: [
      { amount: 600, unit: "g", item: "kuřecí nebo vepřové maso" },
      { amount: 1, unit: "lžíce", item: "olej" },
      { amount: 1, unit: "lžička", item: "sůl" }
    ],
    allergens: [],
    suitableFor: [],
    calories: 250,
    workflow: "Osol a opeč na pánvi či v troubě."
  },
  {
    id: 10,
    title: "Ovesná kaše s ovocem",
    servings: 2,
    tags: ["snídaně"],
    photo_urls: ["/imgRecipe/ovesna-kase.webp"],
    ingredients: [
      { amount: 80, unit: "g", item: "ovesné vločky" },
      { amount: 250, unit: "ml", item: "mléko nebo rostlinný nápoj" },
      { amount: 1, unit: "hrst", item: "ovoce" }
    ],
    allergens: ["lepek", "mléko"],
    suitableFor: [],
    calories: 350,
    workflow: "Povař vločky v mléce do zhoustnutí, podávej s ovocem."
  },
  {
    id: 11,
    title: "Míchaná vejce s toastem",
    servings: 2,
    tags: ["snídaně"],
    photo_urls: ["/imgRecipe/michana-vejce.webp"],
    ingredients: [
      { amount: 4, unit: "", item: "vejce" },
      { amount: 1, unit: "lžíce", item: "máslo" },
      { amount: 2, unit: "ks", item: "toast" },
      { amount: 1, unit: "špetka", item: "sůl" }
    ],
    allergens: ["vejce", "mléko", "lepek"],
    suitableFor: [],
    calories: 420,
    workflow: "Na másle krátce míchej vejce, podávej s opečeným toastem."
  },
  {
    id: 12,
    title: "Jogurt s granolou a medem",
    servings: 2,
    tags: ["snídaně", "svačiny"],
    photo_urls: ["/imgRecipe/jogurt-granola.webp"],
    ingredients: [
      { amount: 300, unit: "g", item: "bílý jogurt" },
      { amount: 60, unit: "g", item: "granola" },
      { amount: 1, unit: "lžíce", item: "med" }
    ],
    allergens: ["mléko", "lepek (dle granoly)"],
    suitableFor: [],
    calories: 320,
    workflow: "Do misky dej jogurt, zasyp granolou a pokapej medem."
  },
  {
    id: 13,
    title: "Tvaroh s ovocem",
    servings: 2,
    tags: ["snídaně", "svačiny"],
    photo_urls: ["/imgRecipe/tvaroh-ovoce.webp"],
    ingredients: [
      { amount: 250, unit: "g", item: "měkký tvaroh" },
      { amount: 1, unit: "lžíce", item: "med" },
      { amount: 1, unit: "hrst", item: "ovoce" }
    ],
    allergens: ["mléko"],
    suitableFor: [],
    calories: 280,
    workflow: "Tvaroh promíchej s medem a podávej s ovocem."
  },
  {
    id: 14,
    title: "Avokádový toast",
    servings: 2,
    tags: ["snídaně", "svačiny"],
    photo_urls: ["/imgRecipe/avokadovy-toast.webp"],
    ingredients: [
      { amount: 2, unit: "ks", item: "plátky chleba" },
      { amount: 1, unit: "ks", item: "avokádo" },
      { amount: 1, unit: "špetka", item: "sůl" },
      { amount: 1, unit: "špetka", item: "pepř" }
    ],
    allergens: ["lepek"],
    suitableFor: ["veganské"],
    calories: 350,
    workflow: "Rozmačkej avokádo, namaž na opečený chléb a dochuť."
  },
  {
    id: 15,
    title: "Banánové palačinky (bez mouky)",
    servings: 2,
    tags: ["snídaně", "moučníky"],
    photo_urls: ["/imgRecipe/bananove-palacinky.webp"],
    ingredients: [
      { amount: 2, unit: "", item: "banány" },
      { amount: 2, unit: "", item: "vejce" }
    ],
    allergens: ["vejce"],
    suitableFor: ["bez lepku"],
    calories: 300,
    workflow: "Rozmačkej banány s vejci a opeč malé placičky."
  },
  {
    id: 16,
    title: "Chia pudink s kokosovým mlékem",
    servings: 2,
    tags: ["snídaně", "svačiny", "moučníky"],
    photo_urls: ["/imgRecipe/chia-pudink.webp"],
    ingredients: [
      { amount: 3, unit: "lžíce", item: "chia semínka" },
      { amount: 250, unit: "ml", item: "kokosové mléko" }
    ],
    allergens: [],
    suitableFor: ["veganské", "bez lepku"],
    calories: 280,
    workflow: "Zamíchej a nech přes noc nabobtnat v lednici."
  },
  {
    id: 17,
    title: "Smoothie bowl",
    servings: 2,
    tags: ["snídaně"],
    photo_urls: ["/imgRecipe/smoothie-bowl.webp"],
    ingredients: [
      { amount: 2, unit: "", item: "banány" },
      { amount: 200, unit: "g", item: "mražené ovoce" },
      { amount: 100, unit: "ml", item: "rostlinný nápoj" }
    ],
    allergens: [],
    suitableFor: ["veganské", "bez lepku"],
    calories: 260,
    workflow: "Rozmixuj do husté konzistence a dozdob ovocem."
  },
  {
    id: 18,
    title: "Hummus s pita chlebem",
    servings: 4,
    tags: ["svačiny", "večeře"],
    photo_urls: ["/imgRecipe/hummus.webp"],
    ingredients: [
      { amount: 400, unit: "g", item: "uvařená cizrna" },
      { amount: 2, unit: "lžíce", item: "tahini" },
      { amount: 2, unit: "lžíce", item: "olivový olej" },
      { amount: 1, unit: "stroužek", item: "česnek" },
      { amount: 1, unit: "ks", item: "citron (šťáva)" }
    ],
    allergens: ["sezam"],
    suitableFor: ["veganské"],
    calories: 420,
    workflow: "Rozmixuj dohladka, podávej s pitou či zeleninou."
  },
  {
    id: 19,
    title: "Ovocný salát s mátou",
    servings: 4,
    tags: ["svačiny", "moučníky"],
    photo_urls: ["/imgRecipe/ovocny-salat.webp"],
    ingredients: [
      { amount: 600, unit: "g", item: "mix ovoce" },
      { amount: 1, unit: "lžíce", item: "med" },
      { amount: 1, unit: "hrst", item: "čerstvá máta" }
    ],
    allergens: [],
    suitableFor: ["veganské", "bez lepku"],
    calories: 180,
    workflow: "Nakrájej ovoce, promíchej s medem a mátou."
  },
  {
    id: 20,
    title: "Cottage s bylinkami",
    servings: 2,
    tags: ["svačiny", "snídaně"],
    photo_urls: ["/imgRecipe/cottage-bylinky.webp"],
    ingredients: [
      { amount: 200, unit: "g", item: "cottage sýr" },
      { amount: 1, unit: "lžíce", item: "pažitka/petržel" },
      { amount: 1, unit: "špetka", item: "sůl" }
    ],
    allergens: ["mléko"],
    suitableFor: [],
    calories: 210,
    workflow: "Smíchej s bylinkami a podávej s pečivem nebo zeleninou."
  },
  {
    id: 21,
    title: "Caprese",
    servings: 2,
    tags: ["svačiny", "večeře"],
    photo_urls: ["/imgRecipe/caprese.webp"],
    ingredients: [
      { amount: 2, unit: "", item: "rajčata" },
      { amount: 125, unit: "g", item: "mozzarella" },
      { amount: 1, unit: "hrst", item: "bazalka" },
      { amount: 1, unit: "lžíce", item: "olivový olej" }
    ],
    allergens: ["mléko"],
    suitableFor: ["bez lepku"],
    calories: 350,
    workflow: "Nakrájej, poskládej na talíř, zakápni olejem a dochuť."
  },
  {
    id: 22,
    title: "Guacamole s kukuřičnými chipsy",
    servings: 4,
    tags: ["svačiny"],
    photo_urls: ["/imgRecipe/guacamole.webp"],
    ingredients: [
      { amount: 2, unit: "ks", item: "avokádo" },
      { amount: 0.5, unit: "", item: "limeta (šťáva)" },
      { amount: 1, unit: "špetka", item: "sůl" },
      { amount: 150, unit: "g", item: "kukuřičné chipsy" }
    ],
    allergens: [],
    suitableFor: ["veganské", "bez lepku"],
    calories: 420,
    workflow: "Avokádo rozmačkej s limetou a solí, podávej s chipsy."
  },
  {
    id: 23,
    title: "Rajčatová polévka",
    servings: 4,
    tags: ["polévky"],
    photo_urls: ["/imgRecipe/rajcatova-polevka.webp"],
    ingredients: [
      { amount: 800, unit: "g", item: "rajčata (nebo pasírovaná)" },
      { amount: 1, unit: "", item: "cibule" },
      { amount: 2, unit: "lžíce", item: "olivový olej" },
      { amount: 500, unit: "ml", item: "zeleninový vývar" }
    ],
    allergens: [],
    suitableFor: ["veganské", "bez lepku"],
    calories: 120,
    workflow: "Orestuj cibuli, přidej rajčata, vývar, provař a rozmixuj."
  },
  {
    id: 24,
    title: "Kuřecí vývar",
    servings: 6,
    tags: ["polévky"],
    photo_urls: ["/imgRecipe/kureci-vyvar.webp"],
    ingredients: [
      { amount: 500, unit: "g", item: "kuřecí kosti/stehna" },
      { amount: 2, unit: "", item: "mrkev" },
      { amount: 1, unit: "", item: "petržel" },
      { amount: 1, unit: "", item: "celer" },
      { amount: 2, unit: "l", item: "voda" }
    ],
    allergens: [],
    suitableFor: ["bez mléka"],
    calories: 80,
    workflow: "Táhni na mírném ohni 2–3 h, osol až nakonec."
  },
  {
    id: 25,
    title: "Česnečka",
    servings: 4,
    tags: ["polévky"],
    photo_urls: ["/imgRecipe/cesnecka.webp"],
    ingredients: [
      { amount: 4, unit: "stroužky", item: "česnek" },
      { amount: 1, unit: "l", item: "vývar nebo voda" },
      { amount: 2, unit: "ks", item: "brambory" },
      { amount: 1, unit: "špetka", item: "majoránka" }
    ],
    allergens: [],
    suitableFor: ["veganské", "bez lepku"],
    calories: 120,
    workflow: "Povař brambory, přidej česnek a majoránku, dochuť."
  },
  {
    id: 26,
    title: "Krém z brokolice",
    servings: 4,
    tags: ["polévky"],
    photo_urls: ["/imgRecipe/brokolicovy-krem.webp"],
    ingredients: [
      { amount: 400, unit: "g", item: "brokolice" },
      { amount: 1, unit: "", item: "cibule" },
      { amount: 700, unit: "ml", item: "vývar" }
    ],
    allergens: [],
    suitableFor: ["veganské", "bez lepku"],
    calories: 140,
    workflow: "Uvař brokolici s cibulí ve vývaru a rozmixuj."
  },
  {
    id: 27,
    title: "Hrachová polévka",
    servings: 4,
    tags: ["polévky"],
    photo_urls: ["/imgRecipe/hrachova-polevka.webp"],
    ingredients: [
      { amount: 250, unit: "g", item: "suchý hrách" },
      { amount: 1, unit: "", item: "cibule" },
      { amount: 1, unit: "l", item: "voda" }
    ],
    allergens: [],
    suitableFor: ["veganské"],
    calories: 190,
    workflow: "Namoc hrách, uvař doměkka s cibulí a rozmixuj."
  },
  {
    id: 28,
    title: "Gulášová polévka",
    servings: 4,
    tags: ["polévky"],
    photo_urls: ["/imgRecipe/gulasova-polevka.webp"],
    ingredients: [
      { amount: 200, unit: "g", item: "hovězí kližka" },
      { amount: 1, unit: "", item: "cibule" },
      { amount: 1, unit: "lžíce", item: "mletá paprika" },
      { amount: 800, unit: "ml", item: "vývar" }
    ],
    allergens: [],
    suitableFor: ["bez mléka"],
    calories: 230,
    workflow: "Orestuj cibuli a maso, přisyp papriku, zalij vývarem a provař."
  },
  {
    id: 29,
    title: "Pečené kuře s brambory",
    servings: 4,
    tags: ["obědy", "večeře"],
    photo_urls: ["/imgRecipe/pecene-kure.webp"],
    ingredients: [
      { amount: 1.2, unit: "kg", item: "kuře" },
      { amount: 800, unit: "g", item: "brambory" },
      { amount: 2, unit: "lžíce", item: "olej" },
      { amount: 1, unit: "lžička", item: "sůl" }
    ],
    allergens: [],
    suitableFor: ["bez mléka", "bez lepku"],
    calories: 520,
    workflow: "Osol, potřeme olejem a peč s bramborami do zlatova."
  },
  {
    id: 30,
    title: "Kuřecí stir-fry s rýží",
    servings: 4,
    tags: ["obědy", "večeře"],
    photo_urls: ["/imgRecipe/stirfry.webp"],
    ingredients: [
      { amount: 400, unit: "g", item: "kuřecí prsa" },
      { amount: 400, unit: "g", item: "mix zeleniny" },
      { amount: 2, unit: "lžíce", item: "sojová omáčka" },
      { amount: 300, unit: "g", item: "rýže" }
    ],
    allergens: ["sója"],
    suitableFor: ["bez mléka"],
    calories: 580,
    workflow: "Orestuj maso, přidej zeleninu a omáčku, podávej s rýží."
  },
  {
    id: 31,
    title: "Losos pečený s citronem",
    servings: 4,
    tags: ["obědy", "večeře"],
    photo_urls: ["/imgRecipe/losos.webp"],
    ingredients: [
      { amount: 600, unit: "g", item: "filet z lososa" },
      { amount: 1, unit: "", item: "citron" },
      { amount: 1, unit: "lžička", item: "sůl" }
    ],
    allergens: ["ryby"],
    suitableFor: ["bez lepku", "bez mléka"],
    calories: 480,
    workflow: "Osol, pokapej citronem a peč 12–15 min na 200 °C."
  },
  {
    id: 32,
    title: "Zeleninové rizoto",
    servings: 4,
    tags: ["obědy", "večeře"],
    photo_urls: ["/imgRecipe/rizoto.webp"],
    ingredients: [
      { amount: 300, unit: "g", item: "rýže" },
      { amount: 500, unit: "ml", item: "zeleninový vývar" },
      { amount: 300, unit: "g", item: "zelenina (mrkev, hrášek...)" }
    ],
    allergens: [],
    suitableFor: ["veganské", "bez lepku"],
    calories: 520,
    workflow: "Opékej rýži, postupně dolévej vývar, vmíchej zeleninu."
  },
  {
    id: 33,
    title: "Kuřecí kari s rýží",
    servings: 4,
    tags: ["obědy", "večeře"],
    photo_urls: ["/imgRecipe/kureci-kari.webp"],
    ingredients: [
      { amount: 500, unit: "g", item: "kuřecí prsa" },
      { amount: 400, unit: "ml", item: "kokosové mléko" },
      { amount: 2, unit: "lžíce", item: "kari pasta" },
      { amount: 300, unit: "g", item: "rýže" }
    ],
    allergens: [],
    suitableFor: ["bez lepku", "bez mléka"],
    calories: 700,
    workflow: "Opeč maso, přidej kari a kokos, podávej s rýží."
  },
  {
    id: 34,
    title: "Bramborový guláš",
    servings: 4,
    tags: ["obědy", "večeře"],
    photo_urls: ["/imgRecipe/bramborovy-gulas.webp"],
    ingredients: [
      { amount: 800, unit: "g", item: "brambory" },
      { amount: 1, unit: "", item: "cibule" },
      { amount: 1, unit: "", item: "paprika" },
      { amount: 1, unit: "lžíce", item: "mletá paprika" },
      { amount: 700, unit: "ml", item: "voda/vývar" }
    ],
    allergens: [],
    suitableFor: ["veganské", "bez lepku"],
    calories: 450,
    workflow: "Orestuj cibuli, přidej papriku, brambory a vař do měkka."
  },
  {
    id: 35,
    title: "Pečené brambory s tvarohem",
    servings: 4,
    tags: ["večeře"],
    photo_urls: ["/imgRecipe/brambory-tvaroh.webp"],
    ingredients: [
      { amount: 800, unit: "g", item: "brambory" },
      { amount: 250, unit: "g", item: "tvaroh" },
      { amount: 2, unit: "lžíce", item: "pažitka" }
    ],
    allergens: ["mléko"],
    suitableFor: ["bez lepku"],
    calories: 520,
    workflow: "Brambory upeč ve slupce, rozkroj a podávej s tvarohem a pažitkou."
  },
  {
    id: 36,
    title: "Tortilla s kuřetem a zeleninou",
    servings: 4,
    tags: ["obědy", "večeře"],
    photo_urls: ["/imgRecipe/tortilla.webp"],
    ingredients: [
      { amount: 4, unit: "ks", item: "pšeničné tortilly" },
      { amount: 400, unit: "g", item: "kuřecí maso" },
      { amount: 300, unit: "g", item: "zelenina (paprika, salát)" }
    ],
    allergens: ["lepek"],
    suitableFor: [],
    calories: 680,
    workflow: "Opeč maso, naplň tortilly zeleninou a zabal."
  },
  {
    id: 37,
    title: "Čočka na kyselo s vejcem",
    servings: 4,
    tags: ["obědy", "večeře"],
    photo_urls: ["/imgRecipe/cocka-na-kyselo.webp"],
    ingredients: [
      { amount: 400, unit: "g", item: "hnědá čočka" },
      { amount: 1, unit: "ks", item: "cibule" },
      { amount: 2, unit: "lžíce", item: "ocet" },
      { amount: 4, unit: "", item: "vejce" }
    ],
    allergens: ["vejce"],
    suitableFor: ["bez mléka", "bez lepku"],
    calories: 560,
    workflow: "Uvař čočku doměkka, dochuť octem a podávej s vařeným vejcem."
  },
  {
    id: 38,
    title: "Falafel s bulgurem a salátem",
    servings: 4,
    tags: ["obědy", "večeře"],
    photo_urls: ["/imgRecipe/falafel.webp"],
    ingredients: [
      { amount: 400, unit: "g", item: "suchá cizrna (namáčená)" },
      { amount: 1, unit: "hrst", item: "petržel/koriandr" },
      { amount: 200, unit: "g", item: "bulgur" }
    ],
    allergens: ["lepek (bulgur)"],
    suitableFor: ["veganské"],
    calories: 720,
    workflow: "Rozmixuj cizrnu s bylinkami, vytvaruj kuličky, usmaž/upeč, podávej s bulgurem."
  },
  {
    id: 39,
    title: "Cizrnové kari",
    servings: 4,
    tags: ["obědy", "večeře"],
    photo_urls: ["/imgRecipe/cizrnove-kari.webp"],
    ingredients: [
      { amount: 400, unit: "g", item: "uvařená cizrna" },
      { amount: 400, unit: "ml", item: "kokosové mléko" },
      { amount: 2, unit: "lžíce", item: "kari pasta" }
    ],
    allergens: [],
    suitableFor: ["veganské", "bez lepku"],
    calories: 620,
    workflow: "Společně provař do zhoustnutí, podávej s rýží či plackou."
  },
  {
    id: 40,
    title: "Bábovka",
    servings: 10,
    tags: ["moučníky", "svačiny"],
    photo_urls: ["/imgRecipe/babovka.webp"],
    ingredients: [
      { amount: 300, unit: "g", item: "hladká mouka" },
      { amount: 200, unit: "g", item: "cukr" },
      { amount: 3, unit: "", item: "vejce" },
      { amount: 200, unit: "ml", item: "mléko" },
      { amount: 100, unit: "ml", item: "olej" },
      { amount: 1, unit: "balení", item: "prášek do pečiva" }
    ],
    allergens: ["lepek", "vejce", "mléko"],
    suitableFor: [],
    calories: 380,
    workflow: "Smíchej suroviny, nalij do formy a peč cca 45–55 min na 170 °C."
  },
  {
    id: 41,
    title: "Muffiny s borůvkami",
    servings: 12,
    tags: ["moučníky", "svačiny", "snídaně"],
    photo_urls: ["/imgRecipe/muffiny_boruvky.webp"],
    ingredients: [
      { amount: 250, unit: "g", item: "hladká mouka" },
      { amount: 120, unit: "g", item: "cukr" },
      { amount: 2, unit: "ks", item: "vejce" },
      { amount: 150, unit: "ml", item: "mléko" },
      { amount: 80, unit: "ml", item: "olej" },
      { amount: 1, unit: "balení", item: "prášek do pečiva" },
      { amount: 150, unit: "g", item: "borůvky" }
    ],
    allergens: ["lepek", "vejce", "mléko"],
    suitableFor: [],
    calories: 210,
    workflow: "Smíchej suroviny, přidej borůvky, nalij do formiček a peč cca 20–25 min na 180 °C."
  },
  
  {
    id: 42,
    title: "Celozrnné sušenky",
    servings: 20,
    tags: ["moučníky", "svačiny"],
    photo_urls: ["/imgRecipe/susenky_celozrnne.webp"],
    ingredients: [
      { amount: 200, unit: "g", item: "celozrnná mouka" },
      { amount: 100, unit: "g", item: "máslo" },
      { amount: 80, unit: "g", item: "hnědý cukr" },
      { amount: 1, unit: "ks", item: "vejce" },
      { amount: 1, unit: "lžička", item: "skořice" }
    ],
    allergens: ["lepek", "vejce", "mléko"],
    suitableFor: [],
    calories: 150,
    workflow: "Vypracuj těsto, vyválej a vykrajuj sušenky. Peč cca 12–15 min na 180 °C."
  },
  
  {
    id: 43,
    title: "Domácí granola",
    servings: 8,
    tags: ["snídaně", "svačiny"],
    photo_urls: ["/imgRecipe/domaci_granola.webp"],
    ingredients: [
      { amount: 300, unit: "g", item: "ovesné vločky" },
      { amount: 80, unit: "g", item: "med nebo javorový sirup" },
      { amount: 50, unit: "ml", item: "rostlinný olej" },
      { amount: 80, unit: "g", item: "vlašské ořechy" },
      { amount: 50, unit: "g", item: "mandle" },
      { amount: 50, unit: "g", item: "sušené ovoce (rozinky, brusinky…)" },
      { amount: 1, unit: "lžička", item: "skořice" },
      { amount: 1, unit: "špetka", item: "sůl" }
    ],
    allergens: ["lepek", "ořechy"],
    suitableFor: ["veganské"],
    calories: 380,
    workflow: "Smíchej vločky, ořechy, skořici a sůl. Přidej med a olej, promíchej. Rozprostři na plech s pečicím papírem a peč cca 25–30 min na 160 °C, občas promíchej. Po vychladnutí vmíchej sušené ovoce."
  },
  {
    id: 44,
    title: "Obložený sendvič se šunkou a zeleninou",
    servings: 2,
    tags: ["svačiny", "snídaně", "večeře"],
    photo_urls: ["/imgRecipe/sendvic_sunka.webp"],
    ingredients: [
      { amount: 4, unit: "plátky", item: "celozrnný chléb" },
      { amount: 100, unit: "g", item: "šunka" },
      { amount: 2, unit: "plátky", item: "sýr" },
      { amount: 1, unit: "ks", item: "rajče" },
      { amount: 1, unit: "ks", item: "okurka" },
      { amount: 2, unit: "listy", item: "hlávkový salát" },
      { amount: 1, unit: "lžíce", item: "máslo" },
      { amount: 1, unit: "špetka", item: "pepř" }
    ],
    allergens: ["lepek", "mléko"],
    suitableFor: [],
    calories: 320,
    workflow: "Plátky chleba potřete máslem, navrstvěte šunku, sýr, rajče, okurku a list salátu. Ochuť pepřem a přiklop druhým plátkem chleba. Podávej čerstvé nebo lehce zapečené."
  },
  
  {
    id: 45,
    title: "Shiro miso s tofu a řasou nori",
    servings: 2,
    tags: ["polévky", "snídaně"],
    photo_urls: ["/imgRecipe/shiro_miso.webp"],
    ingredients: [
      { amount: 800, unit: "ml", item: "voda" },
      { amount: 40, unit: "g", item: "shiro miso pasta" },
      { amount: 100, unit: "g", item: "bílé tofu" },
      { amount: 1, unit: "plát", item: "řasa nori" },
      { amount: 2, unit: "ks", item: "jarní cibulka" }
    ],
    allergens: ["sója"],
    suitableFor: ["veganské", "bez lepku"],
    calories: 120,
    workflow: "Vodu přiveď k varu, přidej na kostičky nakrájené tofu a krátce povař. Odstav z ohně, vmíchej shiro miso pastu a sojovou omáčku. Podávej ozdobené nakrájenou jarní cibulkou a kousky řasy nori."
  },
  
  {
    id: 46,
    title: "Banánový chlebíček",
    servings: 10,
    tags: ["moučníky", "svačiny", "snídaně"],
    photo_urls: ["/imgRecipe/bananovy_chlebicek.webp"],
    ingredients: [
      { amount: 3, unit: "ks", item: "zralé banány" },
      { amount: 200, unit: "g", item: "hladká mouka" },
      { amount: 100, unit: "g", item: "třtinový cukr" },
      { amount: 2, unit: "ks", item: "vejce" },
      { amount: 80, unit: "ml", item: "rostlinný olej" },
      { amount: 1, unit: "balení", item: "prášek do pečiva" },
      { amount: 1, unit: "lžička", item: "skořice" },
      { amount: 1, unit: "špetka", item: "sůl" }
    ],
    allergens: ["lepek", "vejce"],
    suitableFor: [],
    calories: 340,
    workflow: "Rozmačkej banány, smíchej s vejci, olejem a cukrem. Vmíchej mouku s práškem do pečiva, skořicí a solí. Těsto nalij do formy a peč cca 50–60 min na 170 °C."
  },
  {
    id: 47,
    title: "Hovězí guláš",
    servings: 4,
    tags: ["obědy"],
    photo_urls: ["/imgRecipe/hovezi_gulas.webp"],
    ingredients: [
      { amount: 600, unit: "g", item: "hovězí kližka" },
      { amount: 2, unit: "ks", item: "cibule" },
      { amount: 3, unit: "stroužky", item: "česnek" },
      { amount: 2, unit: "lžíce", item: "sádlo" },
      { amount: 1, unit: "lžíce", item: "sladká paprika" },
      { amount: 1, unit: "lžička", item: "kmín" },
      { amount: 500, unit: "ml", item: "hovězí vývar" },
      { amount: 1, unit: "špetka", item: "sůl" },
      { amount: 1, unit: "špetka", item: "pepř" }
    ],
    allergens: [],
    suitableFor: ["bez lepku"],
    calories: 450,
    workflow: "Na sádle osmaž cibuli dozlatova, přidej česnek, papriku a kmín. Vmíchej maso, osmahni a podlij vývarem. Duste přikryté cca 90 minut, dokud není maso měkké. Podávej s houskovým knedlíkem nebo chlebem."
  },
  {
    id: 48,
    title: "Banánové mléko",
    servings: 4,
    tags: ["svačiny"],
    photo_urls: ["/imgRecipe/mleko_bananove.webp"],
    ingredients: [
      { amount: 4, unit: "ks", item: "banán" },
      { amount: 400, unit: "ml", item: "mléko" },
      { amount: 4, unit: "špetka", item: "skořice" },
    ],
    allergens: ["mléko"],
    suitableFor: ["bez lepku"],
    calories: 0,
    workflow: "Rozmixuj banány s mlékem, nalij do sklenic a posyp špetkou skořice."
  },
  {
    id: 49,
    title: "Boršč",
    servings: 6,
    tags: ["polévky", "obědy"],
    photo_urls: ["/imgRecipe/borsc.webp"],
    ingredients: [
      { amount: 300, unit: "g", item: "hovězí maso" },
      { amount: 2, unit: "ks", item: "červená řepa" },
      { amount: 300, unit: "g", item: "bílé zelí" },
      { amount: 2, unit: "ks", item: "brambory" },
      { amount: 1, unit: "ks", item: "mrkev" },
      { amount: 1, unit: "ks", item: "cibule" },
      { amount: 2, unit: "lžíce", item: "rajčatový protlak" },
      { amount: 1.5, unit: "l", item: "hovězí vývar" },
      { amount: 2, unit: "lžíce", item: "olej" },
      { amount: 1, unit: "lžíce", item: "ocet nebo citronová šťáva" },
      { amount: 1, unit: "špetka", item: "sůl" },
      { amount: 1, unit: "špetka", item: "pepř" }
    ],
    allergens: [],
    suitableFor: ["bez mléka"],
    calories: 320,
    workflow: "Maso uvař ve vývaru téměř doměkka. Na oleji orestuj cibuli a mrkev, přidej řepu a rajčatový protlak. Do vývaru vlož brambory a zelí, po chvíli přidej orestovanou zeleninu a maso. Vař do změknutí, dochuť octem, solí a pepřem."
  }
];
