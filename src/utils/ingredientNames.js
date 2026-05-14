const COUNT_UNIT = "ks";

const INGREDIENT_NAME_GROUPS = [
  { canonical: "sůl", aliases: ["soli"], measuredName: "soli" },
  { canonical: "pepř", aliases: ["pepře"], measuredName: "pepře" },
  { canonical: "voda", aliases: ["vody", "vlažná voda", "vlažné vody"], measuredName: "vody" },
  { canonical: "bobkový list", aliases: ["bobkového listu"], measuredName: "bobkového listu" },
  { canonical: "nové koření", aliases: ["nového koření"], measuredName: "nového koření" },
  {
    canonical: "olej",
    aliases: ["oleje", "rostlinný olej", "rostlinného oleje"],
    measuredName: "oleje",
  },
  { canonical: "olivový olej", aliases: ["olivového oleje"], measuredName: "olivového oleje" },
  { canonical: "olej na smažení", aliases: ["oleje na smažení"], measuredName: "oleje na smažení" },
  {
    canonical: "hladká mouka",
    aliases: ["hladké mouky", "mouka hladká"],
    measuredName: "hladké mouky",
  },
  { canonical: "cukr", aliases: ["cukru"], measuredName: "cukru" },
  { canonical: "mléko", aliases: ["mléka"], measuredName: "mléka" },
  { canonical: "máslo", aliases: ["másla"], measuredName: "másla" },
  {
    canonical: "burákové máslo",
    aliases: ["burákového másla", "arašídové máslo", "arašídového másla"],
    measuredName: "burákového másla",
  },
  { canonical: "cibule", aliases: ["cibuli"], measuredName: "cibule" },
  { canonical: "česnek", aliases: ["česneku"], measuredName: "česneku" },
  { canonical: "brambory", aliases: ["brambor", "brambora"], measuredName: "brambor" },
  {
    canonical: "brusinky",
    aliases: ["sušené brusinky", "sušených brusinek"],
    measuredName: "brusinek",
  },
  { canonical: "rajčata", aliases: ["rajče", "rajčat"], measuredName: "rajčat" },
  { canonical: "mrkev", aliases: ["mrkve"], measuredName: "mrkve" },
  { canonical: "petržel", aliases: ["petržele"], measuredName: "petržele" },
  { canonical: "celer", aliases: ["celeru"], measuredName: "celeru" },
  { canonical: "rýže", aliases: ["rýži"], measuredName: "rýže" },
  { canonical: "čočka", aliases: ["čočky", "čočku"], measuredName: "čočky" },
  { canonical: "těstoviny", aliases: ["těstovin"], measuredName: "těstovin" },
  {
    canonical: "sladká paprika",
    aliases: ["sladké papriky", "mletá paprika", "mleté papriky"],
    measuredName: "sladké papriky",
  },
  { canonical: "uzená paprika", aliases: ["uzené papriky"], measuredName: "uzené papriky" },
  {
    canonical: "celozrnná mouka",
    aliases: ["celozrnné mouky"],
    measuredName: "celozrnné mouky",
  },
  { canonical: "polohrubá mouka", aliases: ["polohrubé mouky"], measuredName: "polohrubé mouky" },
  { canonical: "hrubá mouka", aliases: ["hrubé mouky"], measuredName: "hrubé mouky" },
  { canonical: "špaldová mouka", aliases: ["špaldové mouky"], measuredName: "špaldové mouky" },
  {
    canonical: "celozrnná špaldová mouka",
    aliases: ["celozrnné špaldové mouky", "celozrnná špalda", "celozrnné špaldy"],
    measuredName: "celozrnné špaldové mouky",
  },
  {
    canonical: "hladká špaldová mouka",
    aliases: ["hladké špaldové mouky", "hladká špalda", "hladké špaldy"],
    measuredName: "hladké špaldové mouky",
  },
  { canonical: "pohanková mouka", aliases: ["pohankové mouky"], measuredName: "pohankové mouky" },
  { canonical: "rýžová mouka", aliases: ["rýžové mouky"], measuredName: "rýžové mouky" },
  { canonical: "čiroková mouka", aliases: ["čirokové mouky"], measuredName: "čirokové mouky" },
  { canonical: "kukuřičná mouka", aliases: ["kukuřičné mouky"], measuredName: "kukuřičné mouky" },
  { canonical: "hnědý cukr", aliases: ["hnědého cukru"], measuredName: "hnědého cukru" },
  { canonical: "třtinový cukr", aliases: ["třtinového cukru"], measuredName: "třtinového cukru" },
  {
    canonical: "vanilkový cukr",
    aliases: ["vanilkového cukru"],
    measuredName: "vanilkového cukru",
  },
  {
    canonical: "balzamikový ocet",
    aliases: ["balzamikového octa"],
    measuredName: "balzamikového octa",
  },
  { canonical: "jablečný ocet", aliases: ["jablečného octa"], measuredName: "jablečného octa" },
  { canonical: "rýžový ocet", aliases: ["rýžového octa"], measuredName: "rýžového octa" },
  { canonical: "kokosové mléko", aliases: ["kokosového mléka"], measuredName: "kokosového mléka" },
  {
    canonical: "rostlinné mléko",
    aliases: ["rostlinného mléka"],
    measuredName: "rostlinného mléka",
  },
  {
    canonical: "rostlinný nápoj",
    aliases: ["rostlinného nápoje"],
    measuredName: "rostlinného nápoje",
  },
  { canonical: "bílý jogurt", aliases: ["bílého jogurtu"], measuredName: "bílého jogurtu" },
  { canonical: "cottage", aliases: ["cottage sýr", "cottage sýru"], measuredName: "cottage" },
  { canonical: "sýr", aliases: ["sýra", "strouhaný sýr", "strouhaného sýra"], measuredName: "sýra" },
  {
    canonical: "eidam",
    aliases: ["eidamu", "strouhaný eidam", "strouhaného eidamu"],
    measuredName: "eidamu",
  },
  {
    canonical: "parmezán",
    aliases: ["parmezánu", "strouhaný parmezán", "strouhaného parmezánu"],
    measuredName: "parmezánu",
  },
  {
    canonical: "mozzarella",
    aliases: ["mozzarelly", "strouhaná mozzarella", "strouhané mozzarelly"],
    measuredName: "mozzarelly",
  },
  {
    canonical: "niva",
    aliases: ["nivy", "strouhaná niva", "strouhané nivy"],
    measuredName: "nivy",
  },
  { canonical: "měkký tvaroh", aliases: ["měkkého tvarohu"], measuredName: "měkkého tvarohu" },
  { canonical: "hovězí maso", aliases: ["hovězího masa"], measuredName: "hovězího masa" },
  {
    canonical: "hovězí mleté maso",
    aliases: ["hovězího mletého masa"],
    measuredName: "hovězího mletého masa",
  },
  {
    canonical: "mleté hovězí maso",
    aliases: ["mletého hovězího masa"],
    measuredName: "mletého hovězího masa",
  },
  { canonical: "kuřecí maso", aliases: ["kuřecího masa"], measuredName: "kuřecího masa" },
  { canonical: "vepřové maso", aliases: ["vepřového masa"], measuredName: "vepřového masa" },
  { canonical: "hovězí vývar", aliases: ["hovězího vývaru"], measuredName: "hovězího vývaru" },
  { canonical: "kuřecí vývar", aliases: ["kuřecího vývaru"], measuredName: "kuřecího vývaru" },
  {
    canonical: "zeleninový vývar",
    aliases: ["zeleninového vývaru"],
    measuredName: "zeleninového vývaru",
  },
  {
    canonical: "rajčatový protlak",
    aliases: ["rajčatového protlaku"],
    measuredName: "rajčatového protlaku",
  },
  {
    canonical: "rajský protlak",
    aliases: ["rajského protlaku"],
    measuredName: "rajského protlaku",
  },
  { canonical: "rajčatová pasta", aliases: ["rajčatové pasty"], measuredName: "rajčatové pasty" },
  {
    canonical: "rajčatová omáčka",
    aliases: ["rajčatové omáčky"],
    measuredName: "rajčatové omáčky",
  },
  { canonical: "červená paprika", aliases: ["červené papriky"], measuredName: "červené papriky" },
  { canonical: "červená cibule", aliases: ["červené cibule"], measuredName: "červené cibule" },
  { canonical: "červená řepa", aliases: ["červené řepy"], measuredName: "červené řepy" },
  { canonical: "jarní cibulka", aliases: ["jarní cibulky"], measuredName: "jarní cibulky" },
  { canonical: "bílé zelí", aliases: ["bílého zelí"], measuredName: "bílého zelí" },
  { canonical: "bílé tofu", aliases: ["bílého tofu"], measuredName: "bílého tofu" },
  { canonical: "uzené tofu", aliases: ["uzeného tofu"], measuredName: "uzeného tofu" },
  { canonical: "červené fazole", aliases: ["červených fazolí"], measuredName: "červených fazolí" },
  { canonical: "bílé fazole", aliases: ["bílých fazolí"], measuredName: "bílých fazolí" },
  { canonical: "ovesné vločky", aliases: ["ovesných vloček"], measuredName: "ovesných vloček" },
  { canonical: "chia semínka", aliases: ["chia semínek"], measuredName: "chia semínek" },
  {
    canonical: "banány",
    aliases: ["zralé banány", "zralých banánů"],
    measuredName: "banánů",
  },
  {
    canonical: "sezamová semínka",
    aliases: ["sezamových semínek"],
    measuredName: "sezamových semínek",
  },
  {
    canonical: "slunečnicová semínka",
    aliases: ["slunečnicových semínek"],
    measuredName: "slunečnicových semínek",
  },
  { canonical: "ořechy", aliases: ["ořechů", "nasekané ořechy", "nasekaných ořechů"], measuredName: "ořechů" },
  { canonical: "vlašské ořechy", aliases: ["vlašských ořechů"], measuredName: "vlašských ořechů" },
  { canonical: "sušená rajčata", aliases: ["sušených rajčat"], measuredName: "sušených rajčat" },
  { canonical: "sušené švestky", aliases: ["sušených švestek"], measuredName: "sušených švestek" },
  { canonical: "kuřecí prsa", aliases: ["kuřecích prsou"], measuredName: "kuřecích prsou" },
  {
    canonical: "kuřecí stehna nebo prsa",
    aliases: ["kuřecích stehen nebo prsou"],
    measuredName: "kuřecích stehen nebo prsou",
  },
  { canonical: "vepřová panenka", aliases: ["vepřové panenky"], measuredName: "vepřové panenky" },
  { canonical: "vepřová plec", aliases: ["vepřové plece"], measuredName: "vepřové plece" },
  { canonical: "mražený hrášek", aliases: ["mraženého hrášku"], measuredName: "mraženého hrášku" },
  {
    canonical: "droždí",
    aliases: ["čerstvé droždí", "čerstvého droždí", "kvasnice", "kvasnic"],
    measuredName: "droždí",
  },
  {
    canonical: "sušené droždí",
    aliases: ["sušeného droždí", "sušené kvasnice", "sušených kvasnic"],
    measuredName: "sušeného droždí",
  },
  {
    canonical: "prášek do pečiva",
    aliases: [
      "prášku do pečiva",
      "kypřící prášek",
      "kypřícího prášku",
      "prášek do pečení",
      "prášku do pečení",
      "prdopeč",
      "prdopeče",
    ],
    measuredName: "prášku do pečiva",
  },
  {
    canonical: "bezlepkový prášek do pečiva",
    aliases: ["bezlepkového prášku do pečiva"],
    measuredName: "bezlepkového prášku do pečiva",
  },
  {
    canonical: "pudink",
    aliases: ["pudinku", "pudink v prášku", "pudinku v prášku", "pudinkový prášek", "pudinkového prášku"],
    measuredName: "pudinku",
  },
  { canonical: "jedlá soda", aliases: ["jedlé sody"], measuredName: "jedlé sody" },
  {
    canonical: "celozrnný chléb",
    aliases: ["celozrnného chleba"],
    measuredName: "celozrnného chleba",
  },
  {
    canonical: "toastový chléb",
    aliases: ["toastového chleba"],
    measuredName: "toastového chleba",
  },
  { canonical: "rohlíky", aliases: ["rohlík", "rohlíku"], measuredName: "rohlíků" },
  {
    canonical: "čerstvé bylinky",
    aliases: ["čerstvých bylinek"],
    measuredName: "čerstvých bylinek",
  },
  {
    canonical: "čerstvý koriandr",
    aliases: ["čerstvého koriandru"],
    measuredName: "čerstvého koriandru",
  },
  { canonical: "datlový sirup", aliases: ["datlového sirupu"], measuredName: "datlového sirupu" },
  {
    canonical: "javorový sirup",
    aliases: ["javorového sirupu"],
    measuredName: "javorového sirupu",
  },
  {
    canonical: "dlouhozrnná rýže",
    aliases: ["dlouhozrnné rýže"],
    measuredName: "dlouhozrnné rýže",
  },
  { canonical: "jasmínová rýže", aliases: ["jasmínové rýže"], measuredName: "jasmínové rýže" },
  {
    canonical: "kulatozrnná rýže",
    aliases: ["kulatozrnné rýže"],
    measuredName: "kulatozrnné rýže",
  },
  { canonical: "sushi rýže", aliases: ["sushi rýže"], measuredName: "sushi rýže" },
  { canonical: "cizrna", aliases: ["cizrny", "cizrnu"], measuredName: "cizrny" },
  {
    canonical: "uvařená rýže natural",
    aliases: ["uvařené rýže natural"],
    measuredName: "uvařené rýže natural",
  },
  {
    canonical: "grilovací koření",
    aliases: ["grilovacího koření"],
    measuredName: "grilovacího koření",
  },
  { canonical: "kari koření", aliases: ["kari koření"], measuredName: "kari koření" },
  {
    canonical: "perníkové koření",
    aliases: ["perníkového koření"],
    measuredName: "perníkového koření",
  },
  {
    canonical: "hamburgerová bulka",
    aliases: ["hamburgerové bulky"],
    measuredName: "hamburgerové bulky",
  },
  { canonical: "hovězí kližka", aliases: ["hovězí kližky"], measuredName: "hovězí kližky" },
  { canonical: "hrubozrnná sůl", aliases: ["hrubozrnné soli"], measuredName: "hrubozrnné soli" },
  {
    canonical: "instantní polenta",
    aliases: ["instantní polenty"],
    measuredName: "instantní polenty",
  },
  { canonical: "kuřecí kosti", aliases: ["kuřecích kostí"], measuredName: "kuřecích kostí" },
  {
    canonical: "kuřecí/krůtí maso",
    aliases: ["kuřecího/krůtího masa"],
    measuredName: "kuřecího/krůtího masa",
  },
  {
    canonical: "kuřecí vývar nebo voda",
    aliases: ["kuřecího vývaru nebo vody"],
    measuredName: "kuřecího vývaru nebo vody",
  },
  { canonical: "lasagne pláty", aliases: ["lasagne plátů"], measuredName: "lasagne plátů" },
  { canonical: "lesní marmeláda", aliases: ["lesní marmelády"], measuredName: "lesní marmelády" },
  {
    canonical: "listový salát",
    aliases: [
      "listového salátu",
      "salát",
      "salátu",
      "listy salátu",
      "list salátu",
      "hlávkový salát",
      "hlávkového salátu",
      "ledový salát",
      "ledového salátu",
      "římský salát",
      "římského salátu",
    ],
    measuredName: "listového salátu",
  },
  {
    canonical: "máslo nebo olej",
    aliases: ["máslo/olej", "másla nebo oleje", "másla/oleje"],
    measuredName: "másla nebo oleje",
  },
  { canonical: "maso na řízek", aliases: ["masa na řízek"], measuredName: "masa na řízek" },
  {
    canonical: "med/javorový sirup",
    aliases: ["medu/javorového sirupu"],
    measuredName: "medu/javorového sirupu",
  },
  { canonical: "miso pasta", aliases: ["miso pasty"], measuredName: "miso pasty" },
  { canonical: "mix ovoce", aliases: ["mixu ovoce"], measuredName: "mixu ovoce" },
  { canonical: "mix zeleniny", aliases: ["mixu zeleniny"], measuredName: "mixu zeleniny" },
  { canonical: "mléko nebo voda", aliases: ["mléka nebo vody"], measuredName: "mléka nebo vody" },
  { canonical: "nori vločky", aliases: ["nori vloček"], measuredName: "nori vloček" },
  {
    canonical: "pažitka nebo petrželka",
    aliases: ["pažitka/petrželka", "pažitky nebo petrželky", "pažitky/petrželky"],
    measuredName: "pažitky nebo petrželky",
  },
  { canonical: "perlivá voda", aliases: ["perlivé vody"], measuredName: "perlivé vody" },
  {
    canonical: "pomazánkové máslo",
    aliases: ["pomazánkového másla"],
    measuredName: "pomazánkového másla",
  },
  { canonical: "rybí omáčka", aliases: ["rybí omáčky"], measuredName: "rybí omáčky" },
  { canonical: "sójová omáčka", aliases: ["sójové omáčky"], measuredName: "sójové omáčky" },
  { canonical: "řasa nori", aliases: ["řasy nori"], measuredName: "řasy nori" },
  { canonical: "sádlo", aliases: ["sádla"], measuredName: "sádla" },
  { canonical: "salát (mix)", aliases: ["salátu (mix)"], measuredName: "salátu (mix)" },
  {
    canonical: "skořice celá nebo 1 lžička mleté",
    aliases: ["celé skořice nebo 1 lžičky mleté"],
    measuredName: "celé skořice nebo 1 lžičky mleté",
  },
  {
    canonical: "smetana na vaření",
    aliases: ["smetany na vaření"],
    measuredName: "smetany na vaření",
  },
  {
    canonical: "strouhaný kokos",
    aliases: ["strouhaného kokosu"],
    measuredName: "strouhaného kokosu",
  },
  {
    canonical: "sušená petrželka",
    aliases: ["sušené petrželky"],
    measuredName: "sušené petrželky",
  },
  {
    canonical: "sušené ovoce (rozinky, brusinky…)",
    aliases: ["sušeného ovoce (rozinky, brusinky…)"],
    measuredName: "sušeného ovoce (rozinky, brusinky…)",
  },
  { canonical: "sušený česnek", aliases: ["sušeného česneku"], measuredName: "sušeného česneku" },
  {
    canonical: "tuňák ve vlastní šťávě",
    aliases: ["tuňáka ve vlastní šťávě"],
    measuredName: "tuňáka ve vlastní šťávě",
  },
  { canonical: "tvaroh", aliases: ["tvarohu"], measuredName: "tvarohu" },
  { canonical: "větší brambora", aliases: ["větší brambory"], measuredName: "větší brambory" },
  { canonical: "zázvorová šťáva", aliases: ["zázvorové šťávy"], measuredName: "zázvorové šťávy" },
  {
    canonical: "zelenina (mrkev, hrášek...)",
    aliases: ["zeleniny (mrkev, hrášek...)"],
    measuredName: "zeleniny (mrkev, hrášek...)",
  },
];

const MEASURED_UNITS = new Set([
  "g",
  "kg",
  "ml",
  "l",
  "lžíce",
  "lžička",
  "lžičky",
  "hrnek",
  "hrnky",
  "špetka",
  "stroužek",
  "stroužky",
  "hrst",
  "balení",
  "konzerva",
  "kousek",
  "list",
  "listy",
  "plát",
  "pláty",
  "plátek",
  "plátky",
]);

export const normalizeIngredientKey = (value) =>
  (typeof value === "string" ? value.trim() : "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const INGREDIENT_ALIASES = new Map(
  INGREDIENT_NAME_GROUPS.flatMap(({ canonical, aliases = [] }) =>
    [canonical, ...aliases].map((name) => [normalizeIngredientKey(name), canonical]),
  ),
);

const COOKED_INGREDIENT_PREFIX_PATTERN =
  /^(?:uvarena|uvarene|uvareny|uvarenou|uvareneho|uvarenych|varena|varene|vareny|varenou|vareneho|varenych)-+/;
const COOKED_INGREDIENT_TEXT_PREFIX_PATTERN =
  /^(?:uvařená|uvařené|uvařený|uvařenou|uvařeného|uvařených|vařená|vařené|vařený|vařenou|vařeného|vařených)\s+/i;

const MEASURED_NAMES = new Map(
  INGREDIENT_NAME_GROUPS.map(({ canonical, measuredName }) => [
    normalizeIngredientKey(canonical),
    measuredName,
  ]),
);

const WORD_MEASURED_NAMES = new Map(
  Object.entries({
    avokádo: "avokáda",
    banán: "banánu",
    banány: "banánů",
    batát: "batátu",
    batáty: "batátů",
    bazalka: "bazalky",
    bešamel: "bešamelu",
    borůvky: "borůvek",
    brokolice: "brokolice",
    brusinky: "brusinek",
    citron: "citronu",
    cizrna: "cizrny",
    cottage: "cottage",
    cuketa: "cukety",
    droždí: "droždí",
    dýně: "dýně",
    eidam: "eidamu",
    granola: "granoly",
    hořčice: "hořčice",
    houby: "hub",
    hrušky: "hrušek",
    jablko: "jablka",
    jáhly: "jáhel",
    jahody: "jahod",
    karob: "karobu",
    kečup: "kečupu",
    kmín: "kmínu",
    kurkuma: "kurkumy",
    kuře: "kuřete",
    květák: "květáku",
    majoránka: "majoránky",
    mandle: "mandlí",
    marmeláda: "marmelády",
    med: "medu",
    mozzarella: "mozzarelly",
    niva: "nivy",
    nudle: "nudlí",
    ocet: "octa",
    okurka: "okurky",
    olivy: "oliv",
    ořechy: "ořechů",
    ovoce: "ovoce",
    párek: "párku",
    parmezán: "parmezánu",
    pažitka: "pažitky",
    piškoty: "piškotů",
    polenta: "polenty",
    protlak: "protlaku",
    pyré: "pyré",
    rohlík: "rohlíku",
    rozinky: "rozinek",
    rozmarýn: "rozmarýnu",
    salát: "salátu",
    skořice: "skořice",
    slanina: "slaniny",
    smetana: "smetany",
    strouhanka: "strouhanky",
    sýr: "sýra",
    šafrán: "šafránu",
    škrob: "škrobu",
    špagety: "špaget",
    šunka: "šunky",
    tahini: "tahini",
    tofu: "tofu",
    tortilly: "tortill",
    tuňák: "tuňáka",
    tymián: "tymiánu",
    vejce: "vajec",
    vývar: "vývaru",
    zázvor: "zázvoru",
    zelenina: "zeleniny",
    žampiony: "žampionů",
    žloutky: "žloutků",
  }).map(([name, measuredName]) => [normalizeIngredientKey(name), measuredName]),
);

const getMeasuredAdjective = (word, isPlural) => {
  if (isPlural) {
    if (word.endsWith("í")) return `${word}ch`;
    if (word.endsWith("é")) return `${word.slice(0, -1)}ých`;
    if (word.endsWith("á")) return `${word.slice(0, -1)}ých`;
    if (word.endsWith("ý")) return `${word.slice(0, -1)}ých`;
    return word;
  }

  if (word.endsWith("í")) return `${word}ho`;
  if (word.endsWith("é")) return `${word.slice(0, -1)}ého`;
  if (word.endsWith("á")) return `${word.slice(0, -1)}é`;
  if (word.endsWith("ý")) return `${word.slice(0, -1)}ého`;
  return word;
};

const isPluralMeasuredName = (value) =>
  value.endsWith("ů") || value.endsWith("ek") || value.endsWith("í") || value.endsWith("at");

const getFallbackMeasuredName = (name) => {
  const words = name.split(" ");
  if (words.length === 0) return name;

  const lastWord = words[words.length - 1];
  const measuredLastWord = WORD_MEASURED_NAMES.get(normalizeIngredientKey(lastWord));
  if (!measuredLastWord) return name;

  const isPlural = isPluralMeasuredName(measuredLastWord);
  const measuredWords = words.slice(0, -1).map((word) => getMeasuredAdjective(word, isPlural));

  return [...measuredWords, measuredLastWord].join(" ");
};

export const getCanonicalIngredientName = (value) => {
  const text = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
  if (!text) return "";

  const key = normalizeIngredientKey(text);
  return INGREDIENT_ALIASES.get(key) ?? text.toLocaleLowerCase("cs-CZ");
};

const removeCookedIngredientPrefix = (value) => {
  const key = normalizeIngredientKey(value);
  if (!key) return "";

  return key.replace(COOKED_INGREDIENT_PREFIX_PATTERN, "");
};

export const getBaseIngredientNameForShopping = (value) => {
  const text = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
  const baseText = text.replace(COOKED_INGREDIENT_TEXT_PREFIX_PATTERN, "");
  const baseKey = removeCookedIngredientPrefix(value);
  if (!baseKey) return "";

  return INGREDIENT_ALIASES.get(baseKey) ?? baseText.toLocaleLowerCase("cs-CZ");
};

export const formatIngredientNameForAmount = (itemName, unit) => {
  const canonicalName = getCanonicalIngredientName(itemName);
  if (unit === COUNT_UNIT) return canonicalName;
  if (!MEASURED_UNITS.has(unit)) return canonicalName;

  return (
    MEASURED_NAMES.get(normalizeIngredientKey(canonicalName)) ??
    getFallbackMeasuredName(canonicalName)
  );
};

export const formatShoppingIngredientName = (itemName) =>
  getCanonicalIngredientName(itemName)
    .replace(/\s+nebo\s+/g, " / ")
    .replace(/\s*\/\s*/g, " / ");
