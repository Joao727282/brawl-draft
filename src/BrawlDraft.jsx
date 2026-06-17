import { useState, useMemo, useEffect } from "react";
import { LANGUAGES, TRANSLATIONS, detectLanguage, translate } from "./i18n.js";

// ═══════════════════════════════════════════════════════
// TIER LIST — baseada em dados de meta competitivo (junho 2026)
// Lido diretamente da imagem, sem adivinhação de nomes.
// ═══════════════════════════════════════════════════════
const TIER_DATA = {
  S:  ["Damian","Najia","Pierce","Sirius","Crow","Colette","Lumi","Edgar"],
  A:  ["Mortis","Griff","Otis","Chester","Emz","Clancy","Lola","Charlie","Finx","Leon","Mina"],
  "B+": ["Meeple","Byron","Bo","Bull","Starr Nova","Shade","Kaze","Lily","Cordelius","Alli","Kenji"],
  B:  ["Janet","Gus","Gray","Amber","Spike","Nita","Kit","Colt","Brock","Angelo","Colonel Ruffs"],
  "C+": ["Bea","Gene","8-Bit","Moe","Belle","R-T","Shelly","Meg","Gale"],
  C:  ["Bibi","Frank","Tara","Nani","Carl","Squeak","Pearl","Rico","Poco","Penny","Lou"],
  D:  ["Fang","Buzz","Draco","Buster","Ollie","Trunk","Jae-Yong","Max","Sandy","Pam","Melodie","Stu","Ziggy","Willow","Tick","Barley","Juju","Larry & Lawrie"],
  E:  ["Glowbert","Doug","Berry","Sprout","Piper","Mandy","Eve","Maisie","Bonnie","Mico","Chuck","Bolt","Hank","Ash","Darryl"],
  F:  ["Gigi","Rosa","El Primo","Jacky","Sam","Jessie","Dynamike","Surge","Mr. P","Grom"],
};

const TIER_COLOR = { S:"#e74c3c", A:"#e67e22", "B+":"#9b59b6", B:"#8e44ad", "C+":"#f1c40f", C:"#f39c12", D:"#2ecc71", E:"#27ae60", F:"#3498db" };
const TIER_BG    = { S:"rgba(231,76,60,0.14)", A:"rgba(230,126,34,0.13)", "B+":"rgba(155,89,182,0.13)", B:"rgba(142,68,173,0.12)", "C+":"rgba(241,196,15,0.13)", C:"rgba(243,156,18,0.12)", D:"rgba(46,204,113,0.12)", E:"rgba(39,174,96,0.10)", F:"rgba(52,152,219,0.13)" };
const TIER_LABEL = { S:"Top Meta", A:"Forte/Ótimo", "B+":"Acima da média+", B:"Acima da média", "C+":"Média+", C:"Média", D:"Abaixo da média", E:"Fraco/Ruim", F:"Inútil" };
const TIER_ORDER = ["S","A","B+","B","C+","C","D","E","F"];

// ═══════════════════════════════════════════════════════
// CLASSES — sistema de counter por classe (estratégia geral)
// Usado como reforço de score além do tier e dos counters diretos.
// ═══════════════════════════════════════════════════════
const CLASS_COUNTERS = {
  // quem countera essa classe
  "Assassino":  ["Tanque", "Destruidor", "Controlador"],   // tankeia, elimina antes de chegar, ou stunna/empurra
  "Tanque":     ["Destruidor", "Controlador", "Lançador"], // dano constante, trava avanço, ou ignora paredes
  "Destruidor": ["Atirador", "Controlador", "Lançador"],   // impede de chegar no alcance, trava, ou bombardeia
  "Controlador":["Lançador"],                              // destrói torretas/pets, ignora posicionamento fixo
  "Atirador":   ["Assassino"],                             // alta mobilidade fecha distância rápido
  "Lançador":   ["Assassino", "Destruidor"],                // aproximação rápida ou quebra parede
  "Suporte":    ["AntiSuporte"],                            // sem counter de classe direto — tratado individualmente (Crow)
};
const TYPE_COLOR = { "Assassino":"#9b59b6","Tanque":"#e74c3c","Atirador":"#3498db","Destruidor":"#e67e22","Controlador":"#1abc9c","Suporte":"#27ae60","Lançador":"#f39c12" };

// ═══════════════════════════════════════════════════════
// EMOJIS + CLASSE de cada brawler (roster completo do tier list)
// ═══════════════════════════════════════════════════════
const BRAWLER_META = {
  "Damian":{emoji:"🧛",type:"Tanque"}, "Najia":{emoji:"🗡️",type:"Assassino"}, "Pierce":{emoji:"🔫",type:"Atirador"},
  "Sirius":{emoji:"☀️",type:"Controlador"}, "Crow":{emoji:"🐦",type:"Assassino"}, "Colette":{emoji:"📸",type:"Destruidor"},
  "Lumi":{emoji:"🌙",type:"Atirador"}, "Edgar":{emoji:"🖤",type:"Assassino"},
  "Mortis":{emoji:"🦇",type:"Assassino"}, "Griff":{emoji:"💰",type:"Atirador"}, "Otis":{emoji:"🐙",type:"Controlador"},
  "Chester":{emoji:"🃏",type:"Destruidor"}, "Emz":{emoji:"📱",type:"Controlador"}, "Clancy":{emoji:"🎖️",type:"Tanque"},
  "Lola":{emoji:"🎭",type:"Destruidor"}, "Charlie":{emoji:"🕷️",type:"Controlador"}, "Finx":{emoji:"🐠",type:"Atirador"},
  "Leon":{emoji:"🦁",type:"Assassino"}, "Mina":{emoji:"💃",type:"Assassino"},
  "Meeple":{emoji:"🎲",type:"Controlador"}, "Byron":{emoji:"💊",type:"Suporte"}, "Bo":{emoji:"🏹",type:"Controlador"},
  "Bull":{emoji:"🐂",type:"Tanque"}, "Starr Nova":{emoji:"⭐",type:"Atirador"}, "Shade":{emoji:"👻",type:"Assassino"},
  "Kaze":{emoji:"🌪️",type:"Assassino"}, "Lily":{emoji:"🌸",type:"Assassino"}, "Cordelius":{emoji:"🍄",type:"Assassino"},
  "Alli":{emoji:"🐊",type:"Assassino"}, "Kenji":{emoji:"⚔️",type:"Assassino"},
  "Janet":{emoji:"🎤",type:"Atirador"}, "Gus":{emoji:"🫧",type:"Suporte"}, "Gray":{emoji:"🌀",type:"Suporte"},
  "Amber":{emoji:"🔥",type:"Destruidor"}, "Spike":{emoji:"🌵",type:"Controlador"}, "Nita":{emoji:"🐻",type:"Destruidor"},
  "Kit":{emoji:"🐱",type:"Suporte"}, "Colt":{emoji:"🤠",type:"Atirador"}, "Brock":{emoji:"🚀",type:"Atirador"},
  "Angelo":{emoji:"😇",type:"Atirador"}, "Colonel Ruffs":{emoji:"🐕",type:"Suporte"},
  "Bea":{emoji:"🐝",type:"Atirador"}, "Gene":{emoji:"🧞",type:"Suporte"}, "8-Bit":{emoji:"👾",type:"Atirador"},
  "Moe":{emoji:"🦔",type:"Assassino"}, "Belle":{emoji:"⚡",type:"Atirador"}, "R-T":{emoji:"🤖",type:"Controlador"},
  "Shelly":{emoji:"🔫",type:"Tanque"}, "Meg":{emoji:"🦾",type:"Destruidor"}, "Gale":{emoji:"❄️",type:"Controlador"},
  "Bibi":{emoji:"⚾",type:"Tanque"}, "Frank":{emoji:"🔨",type:"Tanque"}, "Tara":{emoji:"🔮",type:"Suporte"},
  "Nani":{emoji:"🎀",type:"Atirador"}, "Carl":{emoji:"🪃",type:"Destruidor"}, "Squeak":{emoji:"🧸",type:"Controlador"},
  "Pearl":{emoji:"🐚",type:"Destruidor"}, "Rico":{emoji:"🤖",type:"Atirador"}, "Poco":{emoji:"🎸",type:"Suporte"},
  "Penny":{emoji:"🏴‍☠️",type:"Atirador"}, "Lou":{emoji:"🧊",type:"Controlador"},
  "Fang":{emoji:"🦶",type:"Assassino"}, "Buzz":{emoji:"🦈",type:"Assassino"}, "Draco":{emoji:"🐉",type:"Tanque"},
  "Buster":{emoji:"🛡️",type:"Tanque"}, "Ollie":{emoji:"🛹",type:"Assassino"}, "Trunk":{emoji:"🌳",type:"Tanque"},
  "Jae-Yong":{emoji:"🎮",type:"Atirador"}, "Max":{emoji:"⚡",type:"Suporte"}, "Sandy":{emoji:"🏖️",type:"Suporte"},
  "Pam":{emoji:"🔧",type:"Suporte"}, "Melodie":{emoji:"🎵",type:"Assassino"}, "Stu":{emoji:"🏎️",type:"Assassino"},
  "Ziggy":{emoji:"🔌",type:"Controlador"}, "Willow":{emoji:"🌊",type:"Controlador"}, "Tick":{emoji:"⏱️",type:"Lançador"},
  "Barley":{emoji:"🍺",type:"Lançador"}, "Juju":{emoji:"🧿",type:"Suporte"}, "Larry & Lawrie":{emoji:"🤝",type:"Lançador"},
  "Glowbert":{emoji:"✨",type:"Suporte"}, "Doug":{emoji:"🌭",type:"Suporte"}, "Berry":{emoji:"🍓",type:"Suporte"},
  "Sprout":{emoji:"🌱",type:"Lançador"}, "Piper":{emoji:"☂️",type:"Atirador"}, "Mandy":{emoji:"🍬",type:"Atirador"},
  "Eve":{emoji:"🦟",type:"Atirador"}, "Maisie":{emoji:"🎯",type:"Atirador"}, "Bonnie":{emoji:"🧸",type:"Atirador"},
  "Mico":{emoji:"🐒",type:"Assassino"}, "Chuck":{emoji:"🚂",type:"Assassino"},
  "Bolt":{emoji:"⚡",type:"Assassino"}, "Hank":{emoji:"🎈",type:"Tanque"}, "Ash":{emoji:"🗑️",type:"Tanque"}, "Darryl":{emoji:"⚓",type:"Tanque"},
  "Gigi":{emoji:"🎀",type:"Suporte"}, "Rosa":{emoji:"🌿",type:"Tanque"}, "El Primo":{emoji:"🤼",type:"Tanque"},
  "Jacky":{emoji:"⛏️",type:"Tanque"}, "Sam":{emoji:"🥊",type:"Tanque"}, "Jessie":{emoji:"⚡",type:"Controlador"},
  "Dynamike":{emoji:"💣",type:"Lançador"}, "Surge":{emoji:"🎮",type:"Destruidor"}, "Mr. P":{emoji:"🎩",type:"Controlador"},
  "Grom":{emoji:"💥",type:"Lançador"},
};

// monta lista final com tier + meta
function buildRoster() {
  const list = [];
  for (const tier of TIER_ORDER) {
    for (const name of TIER_DATA[tier]) {
      const meta = BRAWLER_META[name] || { emoji:"❓", type:"Destruidor" };
      list.push({ name, tier, emoji: meta.emoji, type: meta.type });
    }
  }
  return list;
}
const BRAWLER_LIST = buildRoster();
const tierRank = (t) => TIER_ORDER.indexOf(t);

// ═══════════════════════════════════════════════════════
// MAPAS — first picks revisados: nenhum brawler de tier
// D/E/F aparece como first pick, mesmo que estivesse antes
// (ex: Grom era F e estava marcado como 1º pick em 6 mapas — corrigido)
// ═══════════════════════════════════════════════════════
const MODE_EMOJI = { "Gem Grab":"💎","Heist":"🏦","Bounty":"⭐","Brawl Ball":"⚽","Hot Zone":"🔥","Knockout":"🥊" };
const MODE_COLOR = { "Gem Grab":"#9b59b6","Heist":"#e74c3c","Bounty":"#f39c12","Brawl Ball":"#27ae60","Hot Zone":"#e17055","Knockout":"#3498db" };
const MODE_BG    = { "Gem Grab":"rgba(155,89,182,0.15)","Heist":"rgba(231,76,60,0.15)","Bounty":"rgba(243,156,18,0.15)","Brawl Ball":"rgba(39,174,96,0.15)","Hot Zone":"rgba(225,112,85,0.15)","Knockout":"rgba(52,152,219,0.15)" };

const MAPS = {
  "Gem Grab": [
    { name:"Hard Rock Mine",  emoji:"⛏️", firstPick:"Damian", top3:["Damian","Otis","Crow"],     tip:"Mid aberto com muro central. Damian domina o controle do gemeiro; Otis e Crow seguram bem o entorno." },
    { name:"Double Swoosh",   emoji:"🌀", firstPick:"Clancy", top3:["Damian","Clancy","Crow"],   tip:"Corredores duplos simétricos. Clancy aguenta as duas rotas sozinho." },
    { name:"Gem Fort",        emoji:"🏰", firstPick:"Shade",  top3:["Shade","Damian","Otis"],    tip:"Muros e arbustos por todo lado — Shade atravessa parede e pega o gemeiro isolado." },
    { name:"Undermine",       emoji:"🕳️", firstPick:"Crow",   top3:["Crow","Damian","Sirius"],   tip:"Layout simétrico longo. Crow cobre as duas pontas com veneno." },
  ],
  "Heist": [
    { name:"Bridge Too Far",  emoji:"🌉", firstPick:"Edgar",   top3:["Edgar","Lumi","Chester"],     tip:"Ponte longa central. Edgar dive constante no cofre, Lumi cobre de longe." },
    { name:"Hot Potato",      emoji:"🥔", firstPick:"Alli",    top3:["Alli","Edgar","Kenji"],       tip:"Pressão constante e arbustos pra emboscar. Alli é difícil de counterar diretamente — pick de ban prioritário." },
    { name:"Kaboom Canyon",   emoji:"💥", firstPick:"Pierce",  top3:["Pierce","Edgar","Lumi"],      tip:"Canyon aberto. Pierce protege o cofre de longe sem se expor." },
    { name:"Safe Zone",       emoji:"🛡️", firstPick:"Colette", top3:["Colette","Chester","Edgar"], tip:"Cofre bem protegido por paredes. Colette estoura tanques defensivos." },
  ],
  "Bounty": [
    { name:"Dry Season",      emoji:"🏜️", firstPick:"Leon",   top3:["Leon","Najia","Mortis"], tip:"Mapa muito aberto. Leon invisível pega estrelas isoladas com facilidade." },
    { name:"Hideout",         emoji:"🌿", firstPick:"Najia",  top3:["Najia","Leon","Shade"],  tip:"Cheio de arbustos — Najia embosca melhor que qualquer outro pick aqui." },
    { name:"Layer Cake",      emoji:"🎂", firstPick:"Sirius", top3:["Sirius","Pierce","Lumi"], tip:"Estrutura em camadas. Sirius controla zonas com seu sol; Pierce e Lumi cobrem de longe." },
    { name:"Shooting Star",   emoji:"🌟", firstPick:"Pierce", top3:["Pierce","Najia","Lumi"], tip:"Mapa aberto com poucos muros. Pierce tem alcance e dano alto pra punir grupos expostos." },
  ],
  "Brawl Ball": [
    { name:"Center Stage",    emoji:"🎭", firstPick:"Damian",  top3:["Damian","Otis","Mortis"],   tip:"Campo central aberto. Damian tankeia e empurra sozinho." },
    { name:"Pinball Dreams",  emoji:"🎱", firstPick:"Otis",    top3:["Otis","Shade","Damian"],    tip:"Muitos muros e ricochetes. Otis tira o controle do oponente; Shade ataca por trás dos muros." },
    { name:"Sneaky Fields",   emoji:"🌾", firstPick:"Damian",  top3:["Damian","Crow","Otis"],     tip:"Arbustos laterais. Damian domina o meio do campo." },
    { name:"Triple Dribble",  emoji:"🏀", firstPick:"Clancy",  top3:["Clancy","Damian","Otis"],   tip:"Três corredores largos. Clancy empurra a bola sozinho até o gol." },
  ],
  "Hot Zone": [
    { name:"Dueling Beetles", emoji:"🐛", firstPick:"Damian", top3:["Damian","Bull","Kenji"],     tip:"Duas zonas separadas. Damian tankeia uma zona inteira; Kenji flanqueia a outra." },
    { name:"Open Business",   emoji:"🏪", firstPick:"Sirius", top3:["Sirius","Damian","Otis"],    tip:"Zona central exposta. Sirius cria área de controle resistindo ao fogo cruzado." },
    { name:"Parallel Plays",  emoji:"🔀", firstPick:"Otis",   top3:["Otis","Bull","Meeple"],      tip:"Zonas paralelas. Otis rouba controle de zona, Meeple sustenta com seus dados." },
    { name:"Ring of Fire",    emoji:"🔥", firstPick:"Kenji",  top3:["Kenji","Bo","Bull"],         tip:"Zona única central. Kenji e Bull flanqueiam bem pra contestar a zona disputada." },
  ],
  "Knockout": [
    { name:"Belle's Rock",    emoji:"🪨", firstPick:"Pierce",  top3:["Pierce","Lumi","Najia"],    tip:"Mapa aberto clássico. Pierce dispara de área à distância, sem precisar se expor." },
    { name:"Flaring Phoenix", emoji:"🦅", firstPick:"Pearl",   top3:["Pearl","Edgar","Lumi"],     tip:"Corredores de fogo. Pearl tem mobilidade pra reposicionar entre as chamas." },
    { name:"Goldarm Gulch",   emoji:"🤠", firstPick:"Najia",   top3:["Najia","Pierce","Shade"],   tip:"Gulch aberto com arbustos. Najia domina emboscadas escondida." },
    { name:"Out in the Open", emoji:"🏔️", firstPick:"Lumi",    top3:["Lumi","Brock","Pierce"],    tip:"Mapa quase sem muros. Lumi e Brock cobrem a extensão toda à distância." },
    { name:"Flowing Springs", emoji:"💧", firstPick:"Chester", top3:["Chester","Najia","Kenji"],  tip:"Muitas coberturas e fluxo lateral. Chester tem fator surpresa nas curvas." },
    { name:"New Horizons",    emoji:"🌅", firstPick:"Pierce",  top3:["Pierce","Najia","Lumi"],    tip:"Mapa horizontalmente longo. Pierce cobre a extensão com alcance e dano." },
  ],
};

// ═══════════════════════════════════════════════════════
// SCORE — combina 3 camadas:
// 1) Counter direto conhecido (se mapeado abaixo)
// 2) Counter de CLASSE (regra geral: Tanque > Assassino, etc.)
// 3) Bônus de tier (S pesa mais que F)
// ═══════════════════════════════════════════════════════
const DIRECT_COUNTERS = {
  // alguns matchups específicos que fogem da regra de classe pura
  "Crow":      { counters:["Byron","Poco","Gus","Pam","Tara","Gene","Colonel Ruffs","Sandy","Juju"] }, // corta-cura: counter de suporte
  "Alli":      { counteredBy:["Kenji"] }, // quase sem counter, mas Kenji aguenta
  "Damian":    { counteredBy:["Colette","Sirius","Otis"] },
  "Otis":      { counters:["Tick","Barley","Dynamike","Sprout","Larry & Lawrie"] }, // lançador-counter de controlador
};

function classScore(myType, enemyType) {
  // myType countera enemyType?
  const list = CLASS_COUNTERS[enemyType] || [];
  if (list.includes(myType)) return 2;
  // checagem inversa (enemy countera eu)
  const inverse = CLASS_COUNTERS[myType] || [];
  if (inverse.includes(enemyType)) return -1.5;
  return 0;
}

function calcScore(brawler, enemies) {
  let score = 0;
  const details = [];
  for (const enemy of enemies) {
    let pointsForThis = 0;
    let result = "neutro";

    const direct = DIRECT_COUNTERS[brawler.name];
    const enemyDirect = DIRECT_COUNTERS[enemy.name];

    if (direct?.counters?.includes(enemy.name)) { pointsForThis = 3; result = "countera"; }
    else if (direct?.counteredBy?.includes(enemy.name)) { pointsForThis = -2.5; result = "perde"; }
    else if (enemyDirect?.counteredBy?.includes(brawler.name)) { pointsForThis = 3; result = "countera"; }
    else if (enemyDirect?.counters?.includes(brawler.name)) { pointsForThis = -2.5; result = "perde"; }
    else {
      const cs = classScore(brawler.type, enemy.type);
      if (cs > 0) { pointsForThis = cs; result = "countera"; }
      else if (cs < 0) { pointsForThis = cs; result = "perde"; }
    }

    score += pointsForThis;
    details.push({ enemy: enemy.name, result });
  }
  const tierBonus = { S:1.7, A:1.45, "B+":1.25, B:1.1, "C+":0.95, C:0.85, D:0.6, E:0.4, F:0.15 };
  return { score: score * (tierBonus[brawler.tier] || 1), details };
}

export default function BrawlDraft() {
  const [lang, setLang]       = useState(detectLanguage());
  const [step, setStep]       = useState("mode");
  const [selMode, setSelMode] = useState(null);
  const [selMap, setSelMap]   = useState(null);
  const [enemies, setEnemies] = useState([]);
  const [search, setSearch]   = useState("");
  const [typeFilter, setType] = useState("Todos");

  const t = (key, vars) => translate(lang, key, vars);
  const tType = (type) => (TRANSLATIONS[lang]?.types?.[type]) || type;
  const tMode = (mode) => (TRANSLATIONS[lang]?.modes?.[mode]) || mode;

  const types = ["Todos","Assassino","Tanque","Atirador","Destruidor","Controlador","Suporte","Lançador"];

  const toggleEnemy = (b) => {
    if (enemies.find(e => e.name === b.name)) setEnemies(enemies.filter(e => e.name !== b.name));
    else if (enemies.length < 3) setEnemies([...enemies, b]);
  };

  const ranked = useMemo(() => {
    if (enemies.length === 0) return [];
    return BRAWLER_LIST
      .filter(b => !enemies.find(e => e.name === b.name))
      .map(b => ({ ...b, ...calcScore(b, enemies) }))
      .filter(b => b.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }, [enemies]);

  const visibleBrawlers = useMemo(() => {
    const s = search.toLowerCase();
    return BRAWLER_LIST.filter(b =>
      !enemies.find(e => e.name === b.name) &&
      b.name.toLowerCase().includes(s) &&
      (typeFilter === "Todos" || b.type === typeFilter)
    );
  }, [search, enemies, typeFilter]);

  const maxScore = ranked[0]?.score || 1;
  const firstPickBrawler = selMap ? BRAWLER_LIST.find(b => b.name === selMap.firstPick) : null;

  const goBack = () => {
    if (step === "draft") { setStep("map"); setEnemies([]); setSearch(""); setType("Todos"); }
    else if (step === "map") { setStep("mode"); setSelMode(null); setSelMap(null); }
  };

  if (step === "mode") return (
    <div style={bg}>
      <Header lang={lang} setLang={setLang} t={t} />
      <div style={{textAlign:"center",marginBottom:"8px"}}>
        <p style={{color:"#b2bec3",fontSize:"13px",margin:0}}>{t("step1of3")} · {t("whichMode")} <b style={{color:"#a29bfe"}}>{t("modeWord")}</b> {t("modeQuestion")}</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:"10px",marginTop:"16px"}}>
        {Object.keys(MAPS).map(mode => (
          <div key={mode} onClick={() => { setSelMode(mode); setStep("map"); }} style={{
            background: MODE_BG[mode], border:`2px solid ${MODE_COLOR[mode]}44`,
            borderRadius:"18px", padding:"18px 12px", textAlign:"center", cursor:"pointer", transition:"all 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.border=`2px solid ${MODE_COLOR[mode]}`}
          onMouseLeave={e => e.currentTarget.style.border=`2px solid ${MODE_COLOR[mode]}44`}>
            <div style={{fontSize:"32px",marginBottom:"8px"}}>{MODE_EMOJI[mode]}</div>
            <div style={{fontWeight:800,fontSize:"14px",color:MODE_COLOR[mode]}}>{tMode(mode)}</div>
            <div style={{fontSize:"10px",color:"rgba(255,255,255,0.4)",marginTop:"4px"}}>{MAPS[mode].length} {t("mapsCount")}</div>
          </div>
        ))}
      </div>
      <div style={{textAlign:"center",marginTop:"24px",fontSize:"9px",color:"rgba(255,255,255,0.15)",lineHeight:1.6}}>
        {t("rosterFooter", { count: BRAWLER_LIST.length })}
      </div>
    </div>
  );

  if (step === "map") return (
    <div style={bg}>
      <Header lang={lang} setLang={setLang} t={t} />
      <BackBtn onClick={goBack} label={t("backToMode")} />
      <div style={{textAlign:"center",marginBottom:"8px"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:"8px",background:MODE_BG[selMode],border:`1px solid ${MODE_COLOR[selMode]}44`,borderRadius:"10px",padding:"4px 14px",marginBottom:"8px"}}>
          <span style={{fontSize:"16px"}}>{MODE_EMOJI[selMode]}</span>
          <span style={{color:MODE_COLOR[selMode],fontWeight:700,fontSize:"13px"}}>{tMode(selMode)}</span>
        </div>
        <p style={{color:"#b2bec3",fontSize:"13px",margin:0}}>{t("step2of3")} · {t("whichMap")} <b style={{color:"#a29bfe"}}>{t("mapWord")}</b>{t("mapQuestion")}</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"10px",marginTop:"12px"}}>
        {MAPS[selMode].map(map => (
          <div key={map.name} onClick={() => { setSelMap(map); setStep("draft"); }} style={{
            background:"rgba(255,255,255,0.04)", border:`1px solid ${MODE_COLOR[selMode]}33`,
            borderRadius:"16px", padding:"14px 16px", cursor:"pointer", transition:"all 0.2s",
            display:"flex", alignItems:"center", gap:"14px",
          }}
          onMouseEnter={e => { e.currentTarget.style.background=MODE_BG[selMode]; e.currentTarget.style.border=`1px solid ${MODE_COLOR[selMode]}`; }}
          onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.border=`1px solid ${MODE_COLOR[selMode]}33`; }}>
            <div style={{fontSize:"28px"}}>{map.emoji}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,fontSize:"15px"}}>{map.name}</div>
              <div style={{fontSize:"11px",color:"#7f8c8d",marginTop:"2px"}}>{map.tip}</div>
            </div>
            <div style={{textAlign:"center",minWidth:"70px"}}>
              <div style={{fontSize:"10px",color:"#a29bfe",marginBottom:"3px",fontWeight:700}}>{t("firstPick")}</div>
              <div style={{fontSize:"18px"}}>{BRAWLER_LIST.find(b=>b.name===map.firstPick)?.emoji || "⭐"}</div>
              <div style={{fontSize:"10px",fontWeight:700,color:"#e74c3c"}}>{map.firstPick}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={bg}>
      <Header lang={lang} setLang={setLang} t={t} />
      <BackBtn onClick={goBack} label={t("backToMap")} />

      <div style={{display:"flex",gap:"8px",alignItems:"center",justifyContent:"center",marginBottom:"16px",flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:"6px",background:MODE_BG[selMode],border:`1px solid ${MODE_COLOR[selMode]}44`,borderRadius:"10px",padding:"4px 12px",fontSize:"12px",fontWeight:700,color:MODE_COLOR[selMode]}}>
          {MODE_EMOJI[selMode]} {tMode(selMode)}
        </div>
        <div style={{color:"rgba(255,255,255,0.3)",fontSize:"12px"}}>·</div>
        <div style={{display:"flex",alignItems:"center",gap:"6px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"4px 12px",fontSize:"12px",fontWeight:700}}>
          {selMap.emoji} {selMap.name}
        </div>
      </div>

      {firstPickBrawler && (
        <div style={{background:"linear-gradient(135deg,rgba(231,76,60,0.1),rgba(231,76,60,0.04))",border:"1px solid rgba(231,76,60,0.3)",borderRadius:"16px",padding:"14px 16px",marginBottom:"16px"}}>
          <div style={{fontSize:"10px",letterSpacing:"3px",color:"#e74c3c",fontWeight:800,marginBottom:"8px",textTransform:"uppercase"}}>{t("firstPickRecommended")}</div>
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            <div style={{fontSize:"34px"}}>{firstPickBrawler.emoji}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:900,fontSize:"17px"}}>{firstPickBrawler.name}</div>
              <div style={{fontSize:"10px",marginTop:"2px"}}>
                <span style={{background:TIER_BG[firstPickBrawler.tier],color:TIER_COLOR[firstPickBrawler.tier],padding:"2px 6px",borderRadius:"5px",fontWeight:800,marginRight:"6px"}}>{t("tier")} {firstPickBrawler.tier}</span>
                <span style={{color:"#7f8c8d"}}>{tType(firstPickBrawler.type)}</span>
              </div>
              <div style={{fontSize:"11px",color:"#b2bec3",marginTop:"5px"}}>{selMap.tip}</div>
            </div>
          </div>
          <div style={{marginTop:"10px",paddingTop:"10px",borderTop:"1px solid rgba(255,255,255,0.07)"}}>
            <div style={{fontSize:"10px",color:"#a29bfe",marginBottom:"5px",fontWeight:700}}>{t("top3OfMap")}</div>
            <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
              {selMap.top3.map((n,i) => {
                const b = BRAWLER_LIST.find(x=>x.name===n);
                return b ? (
                  <div key={n} style={{display:"flex",alignItems:"center",gap:"5px",background:"rgba(255,255,255,0.06)",borderRadius:"8px",padding:"4px 8px"}}>
                    <span style={{fontSize:"14px"}}>{b.emoji}</span>
                    <span style={{fontSize:"11px",fontWeight:700}}>{b.name}</span>
                    <span style={{fontSize:"9px",color:TIER_COLOR[b.tier],fontWeight:800}}>{b.tier}</span>
                    {i===0 && <span style={{fontSize:"9px"}}>🥇</span>}
                    {i===1 && <span style={{fontSize:"9px"}}>🥈</span>}
                    {i===2 && <span style={{fontSize:"9px"}}>🥉</span>}
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}

      <div style={{textAlign:"center",marginBottom:"8px"}}>
        <p style={{color:"#b2bec3",fontSize:"12px",margin:0}}>{t("step3of3")} · {t("selectUpTo3")} <b style={{color:"#e74c3c"}}>{t("upTo3Brawlers")}</b> {t("enemyPicked")}</p>
      </div>
      <div style={{display:"flex",gap:"10px",justifyContent:"center",marginBottom:"14px"}}>
        {[0,1,2].map(i => {
          const e = enemies[i];
          return (
            <div key={i} onClick={() => e && toggleEnemy(e)} style={{
              width:"82px",height:"82px",borderRadius:"16px",
              border: e ? "2px solid #e74c3c" : "2px dashed rgba(255,255,255,0.1)",
              background: e ? "rgba(231,76,60,0.12)" : "rgba(255,255,255,0.02)",
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              cursor: e ? "pointer" : "default", position:"relative", transition:"all 0.2s",
            }}>
              {e ? (<>
                <div style={{fontSize:"24px"}}>{e.emoji}</div>
                <div style={{fontSize:"9px",fontWeight:700,marginTop:"3px",textAlign:"center",padding:"0 4px",lineHeight:1.2}}>{e.name}</div>
                <div style={{position:"absolute",top:"4px",right:"4px",background:"#e74c3c",borderRadius:"50%",width:"14px",height:"14px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"8px",fontWeight:900}}>✕</div>
              </>) : <div style={{color:"rgba(255,255,255,0.15)",fontSize:"22px"}}>+</div>}
            </div>
          );
        })}
      </div>
      {enemies.length > 0 && (
        <div style={{textAlign:"center",marginBottom:"12px"}}>
          <button onClick={() => setEnemies([])} style={{background:"rgba(231,76,60,0.15)",border:"1px solid rgba(231,76,60,0.35)",color:"#e74c3c",padding:"5px 14px",borderRadius:"8px",cursor:"pointer",fontSize:"11px",fontWeight:700}}>{t("clearDraft")}</button>
        </div>
      )}

      {enemies.length > 0 && ranked.length > 0 && (
        <div style={{marginBottom:"20px"}}>
          <Divider label={t("bestCounters")} />
          <div style={{display:"flex",flexDirection:"column",gap:"6px",marginTop:"10px"}}>
            {ranked.map((b, idx) => {
              const pct   = Math.round((Math.max(0,b.score)/maxScore)*100);
              const wins  = b.details.filter(d=>d.result==="countera").map(d=>d.enemy);
              const loses = b.details.filter(d=>d.result==="perde").map(d=>d.enemy);
              const medal = idx===0?"🥇":idx===1?"🥈":idx===2?"🥉":null;
              return (
                <div key={b.name} style={{
                  background: idx<3 ? TIER_BG[b.tier] : "rgba(255,255,255,0.03)",
                  border: idx<3 ? `1px solid ${TIER_COLOR[b.tier]}33` : "1px solid rgba(255,255,255,0.05)",
                  borderRadius:"13px",padding:"10px 13px",display:"flex",alignItems:"center",gap:"10px",
                }}>
                  <div style={{fontSize:medal?"18px":"12px",fontWeight:900,width:"24px",textAlign:"center",
                    color:idx===0?"#f1c40f":idx===1?"#b2bec3":idx===2?"#cd7f32":"rgba(255,255,255,0.2)"}}>{medal||`#${idx+1}`}</div>
                  <div style={{fontSize:"24px"}}>{b.emoji}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:"6px",flexWrap:"wrap"}}>
                      <span style={{fontWeight:800,fontSize:"13px"}}>{b.name}</span>
                      <span style={{fontSize:"8px",fontWeight:700,padding:"1px 5px",borderRadius:"4px",background:TIER_BG[b.tier],color:TIER_COLOR[b.tier]}}>{b.tier}</span>
                      <span style={{fontSize:"8px",color:TYPE_COLOR[b.type]||"#888"}}>{tType(b.type)}</span>
                    </div>
                    <div style={{height:"3px",background:"rgba(255,255,255,0.07)",borderRadius:"3px",margin:"5px 0 4px",overflow:"hidden"}}>
                      <div style={{height:"100%",borderRadius:"3px",width:`${pct}%`,background:pct>=80?"linear-gradient(90deg,#2ecc71,#27ae60)":pct>=50?"linear-gradient(90deg,#f39c12,#e67e22)":"linear-gradient(90deg,#3498db,#2980b9)"}}/>
                    </div>
                    <div style={{fontSize:"9px",display:"flex",gap:"8px",flexWrap:"wrap"}}>
                      {wins.length>0 && <span style={{color:"#2ecc71"}}>{t("counters")} {wins.join(", ")}</span>}
                      {loses.length>0 && <span style={{color:"#e74c3c"}}>{t("losesTo")} {loses.join(", ")}</span>}
                    </div>
                  </div>
                  <div style={{fontSize:"14px",fontWeight:900,minWidth:"30px",textAlign:"center",color:pct>=80?"#2ecc71":pct>=50?"#f39c12":"#3498db"}}>{pct}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Divider label={t("enemyPickLabel")} />
      <div style={{display:"flex",gap:"7px",flexWrap:"wrap",justifyContent:"center",margin:"10px 0"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t("searchPlaceholder")} style={{padding:"7px 12px",borderRadius:"10px",border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.05)",color:"#fff",fontSize:"12px",outline:"none",width:"150px"}}/>
        <select value={typeFilter} onChange={e=>setType(e.target.value)} style={{padding:"7px 8px",borderRadius:"10px",border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.05)",color:"#fff",fontSize:"11px",outline:"none",cursor:"pointer"}}>
          {types.map(ty=><option key={ty} value={ty} style={{background:"#12102e"}}>{ty==="Todos" ? t("allTypes") : tType(ty)}</option>)}
        </select>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(78px,1fr))",gap:"6px"}}>
        {visibleBrawlers.map(b => {
          const isEnemy  = !!enemies.find(e=>e.name===b.name);
          const disabled = enemies.length>=3 && !isEnemy;
          return (
            <div key={b.name} onClick={()=>!disabled&&toggleEnemy(b)} style={{
              background: isEnemy ? "rgba(231,76,60,0.15)" : TIER_BG[b.tier],
              border: isEnemy ? "2px solid #e74c3c" : `1px solid ${TIER_COLOR[b.tier]}22`,
              borderRadius:"12px",padding:"9px 5px",textAlign:"center",cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.3:1,transition:"all 0.15s",
            }}
            onMouseEnter={e=>{if(!disabled)e.currentTarget.style.filter="brightness(1.3)";}}
            onMouseLeave={e=>{e.currentTarget.style.filter="none";}}>
              <div style={{fontSize:"20px"}}>{b.emoji}</div>
              <div style={{fontSize:"9px",fontWeight:700,marginTop:"3px",lineHeight:1.2}}>{b.name}</div>
              <div style={{fontSize:"8px",marginTop:"2px",fontWeight:800,color:TIER_COLOR[b.tier]}}>{b.tier}</div>
            </div>
          );
        })}
      </div>
      {enemies.length===3 && <div style={{textAlign:"center",marginTop:"10px",fontSize:"10px",color:"rgba(255,255,255,0.2)"}}>{t("maxPicks")}</div>}
      <div style={{textAlign:"center",marginTop:"16px",fontSize:"9px",color:"rgba(255,255,255,0.1)"}}>
        {t("footerCredits", { count: BRAWLER_LIST.length })}
      </div>
    </div>
  );
}

const bg = { minHeight:"100vh", background:"linear-gradient(160deg,#0a0a18 0%,#12102e 60%,#0a1520 100%)", fontFamily:"'Segoe UI',system-ui,sans-serif", color:"#fff", padding:"16px", boxSizing:"border-box" };
function Header({ lang, setLang, t }) {
  return (
    <div style={{textAlign:"center",marginBottom:"16px",position:"relative"}}>
      <LanguageSwitcher lang={lang} setLang={setLang} />
      <div style={{fontSize:"9px",letterSpacing:"5px",color:"#a29bfe",marginBottom:"3px",textTransform:"uppercase"}}>{t("eyebrow")}</div>
      <h1 style={{margin:0,fontSize:"clamp(18px,5vw,30px)",fontWeight:900,background:"linear-gradient(90deg,#fd79a8,#a29bfe,#74b9ff)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>⚔️ {t("title")}</h1>
    </div>
  );
}
function LanguageSwitcher({ lang, setLang }) {
  return (
    <div style={{position:"absolute",top:0,right:0,display:"flex",gap:"4px"}}>
      {LANGUAGES.map(l => (
        <button key={l.code} onClick={() => setLang(l.code)} title={l.label} style={{
          background: lang===l.code ? "rgba(162,155,254,0.25)" : "rgba(255,255,255,0.05)",
          border: lang===l.code ? "1px solid rgba(162,155,254,0.5)" : "1px solid rgba(255,255,255,0.1)",
          borderRadius:"8px", padding:"4px 8px", cursor:"pointer", fontSize:"14px",
          opacity: lang===l.code ? 1 : 0.5, transition:"all 0.15s",
        }}>{l.flag}</button>
      ))}
    </div>
  );
}
function BackBtn({ onClick, label }) {
  return <button onClick={onClick} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.6)",padding:"5px 12px",borderRadius:"8px",cursor:"pointer",fontSize:"11px",marginBottom:"12px",display:"block"}}>{label}</button>;
}
function Divider({ label }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"4px"}}>
      <div style={{flex:1,height:"1px",background:"rgba(255,255,255,0.07)"}}/>
      <span style={{fontSize:"10px",letterSpacing:"2px",color:"#636e72",textTransform:"uppercase",whiteSpace:"nowrap"}}>{label}</span>
      <div style={{flex:1,height:"1px",background:"rgba(255,255,255,0.07)"}}/>
    </div>
  );
}
