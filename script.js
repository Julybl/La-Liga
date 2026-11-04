
/* MATCHDAY — UNIVERSO FOOTBALL */
"use strict";

const matches = [
  {
    id: 1,
    date: "2026-11-05",
    weekday: "Jueves",
    month: "nov",
    home: "Manchester City",
    homeShort: "MAN CITY",
    away: "PSG",
    awayShort: "PARIS SG",
    homeFile: "manchester-city.png",
    awayFile: "psg.png"
  },
  {
    id: 2,
    date: "2026-11-06",
    weekday: "Viernes",
    month: "nov",
    home: "Juventus",
    homeShort: "JUVENTUS",
    away: "SSC Napoli",
    awayShort: "NAPOLI",
    homeFile: "juventus.png",
    awayFile: "napoli.png"
  },
  {
    id: 3,
    date: "2026-11-07",
    weekday: "Sábado",
    month: "nov",
    home: "Barcelona",
    homeShort: "BARCELONA",
    away: "Bayern Múnich",
    awayShort: "BAYERN",
    homeFile: "barcelona.png",
    awayFile: "bayern.png"
  },
  {
    id: 4,
    date: "2026-11-08",
    weekday: "Domingo",
    month: "nov",
    home: "Juventus",
    homeShort: "JUVENTUS",
    away: "PSG",
    awayShort: "PARIS SG",
    homeFile: "juventus.png",
    awayFile: "psg.png"
  },
  {
    id: 5,
    date: "2026-11-09",
    weekday: "Lunes",
    month: "nov",
    home: "Barcelona",
    homeShort: "BARCELONA",
    away: "Manchester City",
    awayShort: "MAN CITY",
    homeFile: "barcelona.png",
    awayFile: "manchester-city.png"
  },
  {
    id: 6,
    date: "2026-11-10",
    weekday: "Martes",
    month: "nov",
    home: "Bayern Múnich",
    homeShort: "BAYERN",
    away: "SSC Napoli",
    awayShort: "NAPOLI",
    homeFile: "bayern.png",
    awayFile: "napoli.png"
  }
];

// Horarios locales de Latinoamérica, España y Nevada.
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

const calendarIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 7v5l3 2"/>
  </svg>
`;

const flagUrl = code => `https://flagcdn.com/${code}.svg`;

const dateObj = date => new Date(`${date}T12:00:00`);

const formatDate = date =>
  new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long"
  }).format(dateObj(date)).toUpperCase();

function crest(file, team) {
  return `
    <div class="crest-wrap">
      <img
        class="crest"
        src="./escudos/${file}"
        alt="Escudo de ${team}"
        loading="eager"
        onerror="
          console.error('No se pudo cargar el escudo:', this.src);
          this.onerror = null;
          this.src = './escudos/placeholder.svg';
          this.alt = 'Falta el archivo PNG de ${team}';
        "
      >
    </div>
  `;
}

function renderMatches() {
  const query = search.value.trim().toLocaleLowerCase("es");

  const visible = matches.filter(match => {
    const filterOk =
      activeFilter === "all" || match.month === activeFilter;

    const queryOk =
      `${match.home} ${match.away}`
        .toLocaleLowerCase("es")
        .includes(query);

    return filterOk && queryOk;
  });

  if (!visible.length) {
    grid.innerHTML = `
      <div class="empty-state">
        No hay partidos que coincidan con tu búsqueda.
      </div>
    `;
    return;
  }

  grid.innerHTML = visible.map((match, index) => `
    <article class="match-card" style="animation-delay:${index * 70}ms">

      <div class="match-meta">
        <span class="match-day">
          ${match.weekday.toUpperCase()} · ${formatDate(match.date)}
        </span>
        <span class="match-number">
          MATCH 0${match.id}
        </span>
      </div>

      <div class="match-teams">

        <div class="team">
          ${crest(match.homeFile, match.home)}
          <span class="team-name">${match.home}</span>
          <span class="team-full">${match.homeShort}</span>
        </div>

        <div class="versus">VS</div>

        <div class="team">
          ${crest(match.awayFile, match.away)}
          <span class="team-name">${match.away}</span>
          <span class="team-full">${match.awayShort}</span>
        </div>

      </div>

      <div class="match-footer">
        <div class="match-time">
          ${calendarIcon}
          <span>${match.weekday}, ${formatDate(match.date)}</span>
        </div>

        <span class="time-chip">21:00 VEN</span>

        <button
          class="details-button"
          data-match="${match.id}"
          aria-label="Ver horarios locales del partido ${match.home} contra ${match.away}"
        >
          HORARIOS ↗
        </button>
      </div>

    </article>
  `).join("");

  grid.querySelectorAll("[data-match]").forEach(button => {
    button.addEventListener("click", () => {
      timezoneMatch.value = button.dataset.match;
      renderTimezones();

      document.querySelector("#timezones").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

  // Animación de entrada para las tarjetas.
  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    grid.querySelectorAll(".match-card").forEach(card => {
      observer.observe(card);
    });
  }
}

// Convierte el horario de Venezuela al instante universal.
function getKickoff(match) {
  return new Date(`${match.date}T21:00:00-04:00`);
}

// Obtiene fecha y hora de cualquier región.
function localParts(date, zone) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: zone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    day: "2-digit",
    month: "short",
    weekday: "short"
  });

  return Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter(part => part.type !== "literal")
      .map(part => [part.type, part.value])
  );
}

function renderTimezones() {
  const match =
    matches.find(item => String(item.id) === timezoneMatch.value) ||
    matches[0];

  const kickoff = getKickoff(match);

  timezoneDate.textContent =
    `${match.weekday.toUpperCase()} · ${formatDate(match.date)}`;

  const baseParts = localParts(kickoff, "America/Caracas");

  timezoneList.innerHTML = regions.map(region => {
    const parts = localParts(kickoff, region.zone);

    const isNextDay =
      parts.year !== baseParts.year ||
      parts.month !== baseParts.month ||
      parts.day !== baseParts.day;

    const time = `${parts.hour}:${parts.minute}`;
    const dayLabel = `${parts.weekday} ${parts.day} ${parts.month}`;

    return `
      <div class="timezone-item
        ${isNextDay ? "is-next-day" : ""}
        ${region.source ? "is-source" : ""}">

        <img
          class="flag"
          src="${flagUrl(region.code)}"
          alt="Bandera de ${region.name}"
          loading="lazy"
        >

        <div class="tz-copy">
          <div class="tz-country">${region.name}</div>
          <div class="tz-city">${region.city}</div>
        </div>

        <div class="tz-time">
          ${time}
          <small>${dayLabel.toUpperCase()}</small>
        </div>

      </div>
    `;
  }).join("");
}

// Carga las opciones del selector de horarios.
matches.forEach(match => {
  const option = document.createElement("option");

  option.value = match.id;
  option.textContent =
    `${match.weekday} ${formatDate(match.date)} · ${match.home} vs ${match.away}`;

  timezoneMatch.appendChild(option);
});

// Filtros.
document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;

    document.querySelectorAll(".filter").forEach(item => {
      item.classList.toggle("active", item === button);
    });

    renderMatches();
  });
});

// Buscador.
search.addEventListener("input", renderMatches);

// Selector de horarios.
timezoneMatch.addEventListener("change", renderTimezones);

// Render inicial.
renderMatches();
renderTimezones();
