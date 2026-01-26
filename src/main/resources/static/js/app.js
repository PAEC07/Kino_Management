document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:8080";

  // DOM
  const movieListEl = document.getElementById("movieList");
  const detailsWrapper = document.getElementById("detailsWrapper");

  const inhaltTitel = document.getElementById("inhaltTitel");
  const inhaltText = document.getElementById("inhaltText");
  const infoFsk = document.getElementById("infoFsk");
  const infoFormat = document.getElementById("infoFormat"); // optional (Backend hat ggf. kein format)
  const infoKategorie = document.getElementById("infoKategorie");
  const infoPreis = document.getElementById("infoPreis");

  const vorstellungenTbody = document.getElementById("vorstellungenTbody");

  // Toggle
  const btnViewList = document.getElementById("btnViewList");
  const btnViewCalendar = document.getElementById("btnViewCalendar");
  const listenView = document.getElementById("listenView");
  const kalenderView = document.getElementById("kalenderView");

  // Kalender
  const kalMonatLabel = document.getElementById("kalMonatLabel");
  const kalPrev = document.getElementById("kalPrev");
  const kalNext = document.getElementById("kalNext");
  const kalenderBody = document.getElementById("kalenderBody");

  // Buchung
  const buchenContainer = document.getElementById("buchen");
  const buchenBtn = document.getElementById("buchenBtn");
  const buchenBox = document.getElementById("buchenBox");
  const inhaltBox = document.getElementById("inhaltBox");
  const zurueckBtn = document.getElementById("zurueckBtn");
  const bezahlenBtn = document.getElementById("bezahlenBtn");
  const buchungVorstellungInfo = document.getElementById("buchungVorstellungInfo");

  // Sitz/Preis (dein bestehender Code kann bleiben – hier nur minimal belassen)
  const summeAnzeige = document.getElementById("summeAnzeige");

  // Filter UI (optional: später)
  const filmSuche = document.getElementById("filmSuche");
  const suchBtn = document.getElementById("suchBtn");
  const btnFilterApply = document.getElementById("btnFilterApply");

  // STATE
  let movies = [];
  let shows = [];
  let currentMovieId = null;
  let ausgewaehlteVorstellung = null;

  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  // --- Helpers ---
  async function apiGet(path) {
    const res = await fetch(API_BASE + path);
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return res.json();
  }

  function formatEuroFromCents(cents) {
    const n = Number(cents || 0) / 100;
    return n.toFixed(2).replace(".", ",") + " €";
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function splitISO(iso) {
    if (!iso) return { datum: "", uhrzeit: "" };
    const noOffset = String(iso).replace(/([+-]\d{2}:\d{2}|Z)$/, "");
    const [d, t] = noOffset.split("T");
    return { datum: d || "", uhrzeit: (t || "").slice(0, 5) };
  }

  function getShowFilmId(show) {
    // Backend liefert bei dir: filmId: { id: 1, ... } ODER filmId null
    if (show?.filmId?.id != null) return show.filmId.id;
    if (show?.film?.id != null) return show.film.id;
    if (show?.filmId != null && (typeof show.filmId === "number" || typeof show.filmId === "string")) return show.filmId;
    return null;
  }

  function getMovieById(id) {
    return movies.find(m => String(m.id) === String(id)) || null;
  }

  function getMonatsName(monthIndex) {
    const namen = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
    return namen[monthIndex] || "";
  }

  // --- Rendering ---
  function renderMovieList() {
    if (!movieListEl) return;
    movieListEl.innerHTML = "";

    const search = (filmSuche?.value || "").toLowerCase().trim();

    const filtered = movies.filter(m => {
      const name = String(m.filmname || "").toLowerCase();
      return !search || name.includes(search);
    });

    if (!filtered.length) {
      const li = document.createElement("li");
      li.textContent = "Keine Filme vorhanden.";
      movieListEl.appendChild(li);
      return;
    }

    filtered.forEach(movie => {
      const li = document.createElement("li");
      li.textContent = movie.filmname || "Ohne Titel";
      li.classList.toggle("aktiv", String(movie.id) === String(currentMovieId));
      li.addEventListener("click", () => selectMovie(movie.id));
      movieListEl.appendChild(li);
    });
  }

  function renderDetailsForMovie(movieId) {
    const movie = getMovieById(movieId);
    if (!movie) return;

    if (inhaltTitel) inhaltTitel.textContent = movie.filmname || "Film";
    if (inhaltText) inhaltText.textContent = movie.beschreibung || "";
    if (infoFsk) infoFsk.textContent = movie.fsk ?? "-";
    if (infoKategorie) infoKategorie.textContent = movie.kategorie ?? "-";
    if (infoPreis) infoPreis.textContent = formatEuroFromCents(movie.basispreis ?? 0);

    // Format gibt’s im Backend ggf. nicht -> neutral lassen
    if (infoFormat) infoFormat.textContent = "-";

    detailsWrapper?.classList.remove("hidden");
  }

  function renderShowList() {
    if (!vorstellungenTbody) return;
    vorstellungenTbody.innerHTML = "";
    ausgewaehlteVorstellung = null;

    const relevant = shows
      .filter(s => String(getShowFilmId(s)) === String(currentMovieId))
      .sort((a,b) => String(a.datum || "").localeCompare(String(b.datum || "")));

    if (!relevant.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 3;
      td.textContent = "Keine Vorstellungen vorhanden.";
      tr.appendChild(td);
      vorstellungenTbody.appendChild(tr);
      if (buchenBtn) buchenBtn.disabled = true;
      return;
    }

    relevant.forEach(show => {
      const { datum, uhrzeit } = splitISO(show.datum);
      const saalText = show?.saalId?.id ? `Saal ${show.saalId.id}` : "-";

      const tr = document.createElement("tr");
      const tdDatum = document.createElement("td");
      const tdZeit = document.createElement("td");
      const tdSaal = document.createElement("td");

      tdDatum.textContent = datum || "-";
      tdZeit.textContent = uhrzeit || "-";
      tdSaal.textContent = saalText;

      tr.appendChild(tdDatum);
      tr.appendChild(tdZeit);
      tr.appendChild(tdSaal);

      tr.addEventListener("click", () => {
        // markieren
        [...vorstellungenTbody.querySelectorAll("tr")].forEach(x => x.classList.remove("selected-show"));
        tr.classList.add("selected-show");

        ausgewaehlteVorstellung = show;

        if (buchungVorstellungInfo) {
          const movie = getMovieById(currentMovieId);
          buchungVorstellungInfo.textContent =
            `Ausgewählte Vorstellung: ${movie?.filmname || "Film"} – ${datum}, ${uhrzeit} Uhr, ${saalText}`;
        }

        if (buchenBtn) buchenBtn.disabled = false;
        if (buchenContainer) buchenContainer.classList.remove("hidden");
      });

      vorstellungenTbody.appendChild(tr);
    });

    if (buchenBtn) buchenBtn.disabled = true; // erst nach Auswahl
    if (buchenContainer) buchenContainer.classList.remove("hidden");
  }

  function renderCalendar() {
    if (!kalenderBody || !kalMonatLabel) return;

    kalenderBody.innerHTML = "";
    kalMonatLabel.textContent = `${getMonatsName(currentMonth)} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startWochentag = (firstDay.getDay() + 6) % 7;
    const tageImMonat = lastDay.getDate();

    const relevant = shows.filter(s => String(getShowFilmId(s)) === String(currentMovieId));
    const map = {};
    relevant.forEach(s => {
      const { datum, uhrzeit } = splitISO(s.datum);
      if (!datum) return;
      if (!map[datum]) map[datum] = [];
      map[datum].push({ uhrzeit, show: s });
    });

    let tag = 1;
    for (let r = 0; r < 6; r++) {
      const tr = document.createElement("tr");

      for (let c = 0; c < 7; c++) {
        const td = document.createElement("td");

        if ((r === 0 && c < startWochentag) || tag > tageImMonat) {
          td.classList.add("kalender-empty");
        } else {
          const daySpan = document.createElement("span");
          daySpan.classList.add("tag-nr");
          daySpan.textContent = tag;
          td.appendChild(daySpan);

          const dateStr = `${currentYear}-${pad2(currentMonth + 1)}-${pad2(tag)}`;
          const showsForDate = (map[dateStr] || []).sort((a,b) => String(a.uhrzeit).localeCompare(String(b.uhrzeit)));

          showsForDate.forEach(({ uhrzeit, show }) => {
            const saalText = show?.saalId?.id ? `Saal ${show.saalId.id}` : "-";
            const ev = document.createElement("span");
            ev.classList.add("kal-event");
            ev.textContent = `${uhrzeit || "--:--"} • ${saalText}`;
            td.appendChild(ev);
          });

          tag++;
        }

        tr.appendChild(td);
      }

      kalenderBody.appendChild(tr);
    }
  }

  function setView(mode) {
    if (!listenView || !kalenderView || !btnViewList || !btnViewCalendar) return;
    if (mode === "list") {
      listenView.classList.remove("hidden");
      kalenderView.classList.add("hidden");
      btnViewList.classList.add("active-view");
      btnViewCalendar.classList.remove("active-view");
    } else {
      listenView.classList.add("hidden");
      kalenderView.classList.remove("hidden");
      btnViewList.classList.remove("active-view");
      btnViewCalendar.classList.add("active-view");
    }
  }

  function selectMovie(movieId) {
    currentMovieId = movieId;
    renderMovieList();
    renderDetailsForMovie(movieId);
    renderShowList();
    renderCalendar();
    setView("list");
  }

  async function reloadAll() {
    movies = await apiGet("/api/filme");
    shows = await apiGet("/api/vorstellungen");
    renderMovieList();

    // Wenn noch kein Film gewählt: automatisch ersten wählen
    if (movies.length && currentMovieId == null) {
      selectMovie(movies[0].id);
    }
  }

  // Events
  btnViewList?.addEventListener("click", () => setView("list"));
  btnViewCalendar?.addEventListener("click", () => {
    setView("calendar");
    renderCalendar();
  });

  kalPrev?.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
  });

  kalNext?.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
  });

  btnFilterApply?.addEventListener("click", renderMovieList);
  suchBtn?.addEventListener("click", renderMovieList);
  filmSuche?.addEventListener("keyup", (e) => { if (e.key === "Enter") renderMovieList(); });

  // Buchen / Zurück / Bezahlen (minimal)
  buchenBtn?.addEventListener("click", () => {
    if (!ausgewaehlteVorstellung) {
      alert("Bitte zuerst eine Vorstellung auswählen.");
      return;
    }
    inhaltBox?.classList.add("hidden");
    buchenBox?.classList.remove("hidden");
  });

  zurueckBtn?.addEventListener("click", () => {
    buchenBox?.classList.add("hidden");
    inhaltBox?.classList.remove("hidden");
  });

  bezahlenBtn?.addEventListener("click", () => {
    alert("Buchung übernommen (Demo).");
  });

  // INIT
  detailsWrapper?.classList.add("hidden");
  buchenContainer?.classList.add("hidden");
  if (buchenBtn) buchenBtn.disabled = true;

  (async () => {
    try {
      await reloadAll();
    } catch (e) {
      console.error(e);
      alert("Konnte Daten nicht laden. Läuft Backend auf http://localhost:8080 ?");
    }
  })();
});
