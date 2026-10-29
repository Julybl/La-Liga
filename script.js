/* MATCHDAY — calendario editable */
"use strict";

const matches = [
  { id: 1, date: "2026-10-29", weekday: "Jueves", month: "oct", home: "Bayern Múnich", homeShort: "BAYERN", away: "PSG", awayShort: "PARIS SG", homeFile: "bayern.png", awayFile: "psg.png" },
  { id: 2, date: "2026-10-30", weekday: "Viernes", month: "oct", home: "SSC Napoli", homeShort: "NAPOLI", away: "Barcelona", awayShort: "BARCELONA", homeFile: "napoli.png", awayFile: "barcelona.png" },
  { id: 3, date: "2026-10-31", weekday: "Sábado", month: "oct", home: "Manchester City", homeShort: "MAN CITY", away: "Juventus", awayShort: "JUVENTUS", homeFile: "manchester-city.png", awayFile: "juventus.png" },
  { id: 4, date: "2026-11-01", weekday: "Domingo", month: "nov", home: "SSC Napoli", homeShort: "NAPOLI", away: "PSG", awayShort: "PARIS SG", homeFile: "napoli.png", awayFile: "psg.png" },
  { id: 5, date: "2026-11-02", weekday: "Lunes", month: "nov", home: "Manchester City", homeShort: "MAN CITY", away: "Bayern Múnich", awayShort: "BAYERN", homeFile: "manchester-city.png", awayFile: "bayern.png" },
  { id: 6, date: "2026-11-03", weekday: "Martes", month: "nov", home: "Juventus", homeShort: "JUVENTUS", away: "Barcelona", awayShort: "BARCELONA", homeFile: "juventus.png", awayFile: "barcelona.png" }
];

// Se muestra la hora local de las capitales/zonas indicadas.
// México y Brasil tienen múltiples husos: se incluyen zonas representativas además de Nevada.
const regions = [
  { name:"Argentina", city:"Buenos Aires", code:"ar", zone:"America/Argentina/Buenos_Aires" },
  { name:"Bolivia", city:"La Paz", code:"bo", zone:"America/La_Paz" },
  { name:"Brasil", city:"Brasilia", code:"br", zone:"America/Sao_Paulo" },
  { name:"Chile", city:"Santiago", code:"cl", zone:"America/Santiago" },
  { name:"Colombia", city:"Bogotá", code:"co", zone:"America/Bogota" },
  { name:"Costa Rica", city:"San José", code:"cr", zone:"America/Costa_Rica" },
  { name:"Cuba", city:"La Habana", code:"cu", zone:"America/Havana" },
  { name:"Ecuador", city:"Quito", code:"ec", zone:"America/Guayaquil" },
  { name:"El Salvador", city:"San Salvador", code:"sv", zone:"America/El_Salvador" },
  { name:"Estados Unidos · Nevada", city:"Las Vegas", code:"us", zone:"America/Los_Angeles" },
  { name:"España", city:"Madrid", code:"es", zone:"Europe/Madrid" },
  { name:"Guatemala", city:"Ciudad de Guatemala", code:"gt", zone:"America/Guatemala" },
  { name:"Honduras", city:"Tegucigalpa", code:"hn", zone:"America/Tegucigalpa" },
  { name:"México", city:"Ciudad de México", code:"mx", zone:"America/Mexico_City" },
  { name:"Nicaragua", city:"Managua", code:"ni", zone:"America/Managua" },
  { name:"Panamá", city:"Ciudad de Panamá", code:"pa", zone:"America/Panama" },
  { name:"Paraguay", city:"Asunción", code:"py", zone:"America/Asuncion" },
  { name:"Perú", city:"Lima", code:"pe", zone:"America/Lima" },
  { name:"Rep. Dominicana", city:"Santo Domingo", code:"do", zone:"America/Santo_Domingo" },
  { name:"Uruguay", city:"Montevideo", code:"uy", zone:"America/Montevideo" },
  { name:"Venezuela", city:"Caracas", code:"ve", zone:"America/Caracas", source:true }
];

const grid = document.querySelector("#fixturesGrid");
const timezoneMatch = document.querySelector("#timezoneMatch");
const timezoneList = document.querySelector("#timezoneList");
const timezoneDate = document.querySelector("#timezoneDate");
const search = document.querySelector("#teamSearch");
let activeFilter = "all";

const calendarIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`;
const flagUrl = code => `https://flagcdn.com/${code}.svg`;
const dateObj = date => new Date(`${date}T12:00:00`);
const formatDate = date => new Intl.DateTimeFormat("es-ES", { day:"2-digit", month:"long" }).format(dateObj(date)).toUpperCase();
const dateLong = date => new Intl.DateTimeFormat("es-ES", { weekday:"long", day:"numeric", month:"long" }).format(dateObj(date));

function crest(file, team) {
  return `<div class="crest-wrap"><img class="crest" src="escudos/${file}" alt="Escudo de ${team}" onerror="this.onerror=null;this.src='escudos/placeholder.svg';this.alt='Añadí el PNG de ${team}'"></div>`;
}

function renderMatches() {
  const query = search.value.trim().toLocaleLowerCase("es");
  const visible = matches.filter(m => {
    const filterOk = activeFilter === "all" || m.month === activeFilter;
    const queryOk = `${m.home} ${m.away}`.toLocaleLowerCase("es").includes(query);
    return filterOk && queryOk;
  });
  if (!visible.length) {
    grid.innerHTML = `<div class="empty-state">No hay partidos que coincidan con tu búsqueda.</div>`;
    return;
  }
  grid.innerHTML = visible.map((m, index) => `
    <article class="match-card" style="animation-delay:${index * 70}ms">
      <div class="match-meta"><span class="match-day">${m.weekday.toUpperCase()} · ${formatDate(m.date)}</span><span class="match-number">MATCH 0${m.id}</span></div>
      <div class="match-teams">
        <div class="team">${crest(m.homeFile,m.home)}<span class="team-name">${m.home}</span><span class="team-full">${m.homeShort}</span></div>
        <div class="versus">VS</div>
        <div class="team">${crest(m.awayFile,m.away)}<span class="team-name">${m.away}</span><span class="team-full">${m.awayShort}</span></div>
      </div>
      <div class="match-footer"><div class="match-time">${calendarIcon}<span>${m.weekday}, ${formatDate(m.date)}</span></div><span class="time-chip">21:00 VEN</span><button class="details-button" data-match="${m.id}" aria-label="Ver horarios locales del partido ${m.home} contra ${m.away}">HORARIOS ↗</button></div>
    </article>`).join("");
  grid.querySelectorAll("[data-match]").forEach(btn => btn.addEventListener("click", () => {
    timezoneMatch.value = btn.dataset.match;
    renderTimezones();
    document.querySelector("#timezones").scrollIntoView({behavior:"smooth",block:"start"});
  }));
}

function localParts(date, zone) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: zone, hour:"2-digit", minute:"2-digit", hourCycle:"h23",
    day:"2-digit", month:"short", weekday:"short"
  });
  return Object.fromEntries(formatter.formatToParts(date).filter(p => p.type !== "literal").map(p => [p.type,p.value]));
}

function getKickoff(match) {
  // Venezuela UTC−04:00 durante estas fechas. El instante se convierte con Intl a cada zona local.
  return new Date(`${match.date}T21:00:00-04:00`);
}

function renderTimezones() {
  const match = matches.find(m => String(m.id) === timezoneMatch.value) || matches[0];
  const kickoff = getKickoff(match);
  timezoneDate.textContent = `${match.weekday.toUpperCase()} · ${formatDate(match.date)}`;
  timezoneList.innerHTML = regions.map(region => {
    const parts = localParts(kickoff, region.zone);
    const localDateKey = `${parts.year || ""}-${parts.month}-${parts.day}`;
    const baseParts = localParts(kickoff, "America/Caracas");
    const isNextDay = Number(parts.day) !== Number(baseParts.day) && 
      (parts.month === baseParts.month || (parts.month === "Nov" && baseParts.month === "Oct"));
    const time = `${parts.hour}:${parts.minute}`;
    const dayLabel = `${parts.weekday} ${parts.day} ${parts.month}`;
    return `<div class="timezone-item ${isNextDay ? "is-next-day" : ""} ${region.source ? "is-source" : ""}">
      <img class="flag" src="${flagUrl(region.code)}" alt="Bandera de ${region.name}" loading="lazy">
      <div class="tz-copy"><div class="tz-country">${region.name}</div><div class="tz-city">${region.city}</div></div>
      <div class="tz-time">${time}<small>${dayLabel.toUpperCase()}</small></div>
    </div>`;
  }).join("");
}

matches.forEach(m => {
  const option = document.createElement("option");
  option.value = m.id;
  option.textContent = `${m.weekday} ${formatDate(m.date)} · ${m.home} vs ${m.away}`;
  timezoneMatch.appendChild(option);
});
document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b === button));
  renderMatches();
}));
search.addEventListener("input", renderMatches);
timezoneMatch.addEventListener("change", renderTimezones);
renderMatches();
renderTimezones();

// Entrada animada al hacer scroll, con alternativa para dispositivos que reducen movimiento.
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    }
  }), {threshold: .08});
  document.querySelectorAll(".match-card").forEach(card => observer.observe(card));
}
