// ═══════════════════════════════════════════════════════
// i18n.js — Traduções do Brawl Draft
// Para adicionar um novo idioma: copie um bloco completo
// (ex: "en") e traduza cada valor. A chave (lado esquerdo)
// nunca muda.
// ═══════════════════════════════════════════════════════

export const LANGUAGES = [
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "en", label: "English",   flag: "🇺🇸" },
  { code: "es", label: "Español",   flag: "🇪🇸" },
];

export const TRANSLATIONS = {
  pt: {
    eyebrow: "Ranked Draft Tool · Junho 2026",
    title: "BRAWL STARS DRAFT",

    step1of3: "Passo 1 de 3",
    step2of3: "Passo 2 de 3",
    step3of3: "Passo 3 de 3",
    whichMode: "Qual é o",
    modeWord: "modo",
    modeQuestion: "da partida?",
    whichMap: "Qual é o",
    mapWord: "mapa",
    mapQuestion: "?",
    selectUpTo3: "Selecione até",
    upTo3Brawlers: "3 brawlers",
    enemyPicked: "que o inimigo pickôu",

    mapsCount: "mapas",
    rosterFooter: "Roster: {count} brawlers",

    backToMode: "← Modo",
    backToMap: "← Mapa",

    firstPick: "FIRST PICK",
    firstPickRecommended: "🥇 First Pick Recomendado (específico deste mapa)",
    top3OfMap: "TOP 3 DESSE MAPA",
    tier: "Tier",

    clearDraft: "🗑 Limpar",
    bestCounters: "🏆 Melhores Counter Picks",
    enemyPickLabel: "Pick do inimigo",
    searchPlaceholder: "🔍 Buscar...",
    allTypes: "Todos",
    maxPicks: "Máximo 3 picks. Clique para remover.",
    counters: "✅",
    losesTo: "⚠️",
    footerCredits: "Sistema de counter por classe aplicado · {count} brawlers",

    modes: {
      "Gem Grab": "Coleta de Gemas",
      "Heist": "Roubo",
      "Bounty": "Caça-Recompensas",
      "Brawl Ball": "Brawl Ball",
      "Hot Zone": "Zona Quente",
      "Knockout": "Eliminação",
    },
    types: {
      "Assassino": "Assassino",
      "Tanque": "Tanque",
      "Atirador": "Atirador",
      "Destruidor": "Destruidor",
      "Controlador": "Controlador",
      "Suporte": "Suporte",
      "Lançador": "Lançador",
    },
  },

  en: {
    eyebrow: "Ranked Draft Tool · June 2026",
    title: "BRAWL STARS DRAFT",

    step1of3: "Step 1 of 3",
    step2of3: "Step 2 of 3",
    step3of3: "Step 3 of 3",
    whichMode: "Which",
    modeWord: "mode",
    modeQuestion: "is the match?",
    whichMap: "Which",
    mapWord: "map",
    mapQuestion: "is it?",
    selectUpTo3: "Select up to",
    upTo3Brawlers: "3 brawlers",
    enemyPicked: "the enemy picked",

    mapsCount: "maps",
    rosterFooter: "Roster: {count} brawlers",

    backToMode: "← Mode",
    backToMap: "← Map",

    firstPick: "FIRST PICK",
    firstPickRecommended: "🥇 Recommended First Pick (specific to this map)",
    top3OfMap: "TOP 3 ON THIS MAP",
    tier: "Tier",

    clearDraft: "🗑 Clear",
    bestCounters: "🏆 Best Counter Picks",
    enemyPickLabel: "Enemy pick",
    searchPlaceholder: "🔍 Search...",
    allTypes: "All",
    maxPicks: "Maximum 3 picks. Click to remove.",
    counters: "✅",
    losesTo: "⚠️",
    footerCredits: "Class-counter system applied · {count} brawlers",

    modes: {
      "Gem Grab": "Gem Grab",
      "Heist": "Heist",
      "Bounty": "Bounty",
      "Brawl Ball": "Brawl Ball",
      "Hot Zone": "Hot Zone",
      "Knockout": "Knockout",
    },
    types: {
      "Assassino": "Assassin",
      "Tanque": "Tank",
      "Atirador": "Marksman",
      "Destruidor": "Damage Dealer",
      "Controlador": "Controller",
      "Suporte": "Support",
      "Lançador": "Thrower",
    },
  },

  es: {
    eyebrow: "Ranked Draft Tool · Junio 2026",
    title: "BRAWL STARS DRAFT",

    step1of3: "Paso 1 de 3",
    step2of3: "Paso 2 de 3",
    step3of3: "Paso 3 de 3",
    whichMode: "¿Cuál es el",
    modeWord: "modo",
    modeQuestion: "de la partida?",
    whichMap: "¿Cuál es el",
    mapWord: "mapa",
    mapQuestion: "?",
    selectUpTo3: "Selecciona hasta",
    upTo3Brawlers: "3 brawlers",
    enemyPicked: "que eligió el enemigo",

    mapsCount: "mapas",
    rosterFooter: "Plantilla: {count} brawlers",

    backToMode: "← Modo",
    backToMap: "← Mapa",

    firstPick: "PRIMERA ELECCIÓN",
    firstPickRecommended: "🥇 Primera Elección Recomendada (específica de este mapa)",
    top3OfMap: "TOP 3 DE ESTE MAPA",
    tier: "Tier",

    clearDraft: "🗑 Limpiar",
    bestCounters: "🏆 Mejores Counter Picks",
    enemyPickLabel: "Elección del enemigo",
    searchPlaceholder: "🔍 Buscar...",
    allTypes: "Todos",
    maxPicks: "Máximo 3 elecciones. Haz clic para quitar.",
    counters: "✅",
    losesTo: "⚠️",
    footerCredits: "Sistema de counter por clase aplicado · {count} brawlers",

    modes: {
      "Gem Grab": "Atrapagemas",
      "Heist": "Atraco",
      "Bounty": "Recompensa",
      "Brawl Ball": "Brawl Ball",
      "Hot Zone": "Zona Restringida",
      "Knockout": "Eliminatoria",
    },
    types: {
      "Assassino": "Asesino",
      "Tanque": "Tanque",
      "Atirador": "Tirador",
      "Destruidor": "Destructor",
      "Controlador": "Controlador",
      "Suporte": "Apoyo",
      "Lançador": "Lanzador",
    },
  },
};

// Detecta idioma do navegador, cai pra "en" se não for um dos suportados
export function detectLanguage() {
  if (typeof navigator === "undefined") return "pt";
  const browserLang = navigator.language?.slice(0, 2).toLowerCase();
  if (TRANSLATIONS[browserLang]) return browserLang;
  return "en";
}

// helper de interpolação simples: t("rosterFooter", {count: 104})
export function translate(lang, key, vars = {}) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  let str = dict[key];
  if (str === undefined) str = TRANSLATIONS.en[key] || key;
  Object.entries(vars).forEach(([k, v]) => {
    str = str.replace(`{${k}}`, v);
  });
  return str;
}
