document.addEventListener("DOMContentLoaded", () => {
  // ============================
  // KONFIG
  // ============================
  const API_BASE = "http://localhost:8080";

  // Filme (FilmController)
  const FILM_LIST = "/api/filme/list";
  const FILM_ADD = "/api/filme/add";
  const FILM_DELETE = (id) => `/api/filme/${id}/delete`;

  // Vorstellungen (VorstellungController)
  const SHOW_LIST = "/api/vorstellungen/list";
  const SHOW_ADD = "/api/vorstellungen/add";
  const SHOW_DELETE = (id) => `/api/vorstellungen/${id}/delete`;

  // Säle (SaalController)
  const HALL_LIST = "/api/saal/list";
  const HALL_ADD = "/api/saal/add";
  const HALL_DELETE = (id) => `/api/saal/${id}/delete`;

  // Sitzplan Config (Frontend-only)
  const LS_SITZPLAN_KEY = "kino_sitzplan_config_v1";

  // ============================
  // DOM
  // ============================
  const movieListEl = document.getElementById("movieList");
  const vorstellungenTbody = document.getElementById("vorstellungenTbody");
  const saeleTbody = document.getElementById("saeleTbody");

  const listenView = document.getElementById("listenView");
  const kalenderView = document.getElementById("kalenderView");
  const btnViewList = document.getElementById("btnViewList");
  const btnViewCalendar = document.getElementById("btnViewCalendar");

  const kalenderBody = document.getElementById("kalenderBody");
  const kalMonatLabel = document.getElementById("kalMonatLabel");
  const kalPrev = document.getElementById("kalPrev");
  const kalNext = document.getElementById("kalNext");

  // Filter / Suche
  const filterFormat = document.getElementById("filterFormat"); // UI-only
  const filterFsk = document.getElementById("filterFsk");
  const filterStil = document.getElementById("filterStil");
  const btnFilterApply = document.getElementById("btnFilterApply");
  const filmSuche = document.getElementById("filmSuche");
  const suchBtn = document.getElementById("suchBtn");

  // Modals
  const modalOverlay = document.getElementById("modalOverlay");
  const modalFilm = document.getElementById("modalFilm");
  const modalVorstellung = document.getElementById("modalVorstellung");
  const modalSaal = document.getElementById("modalSaal");
  const modalSitzplan = document.getElementById("modalSitzplan");

  const btnOpenFilmModal = document.getElementById("btnOpenFilmModal");
  const btnOpenVorstellungModal = document.getElementById("btnOpenVorstellungModal");
  const btnOpenSaalModal = document.getElementById("btnOpenSaalModal");
  const btnOpenSitzplanModal = document.getElementById("btnOpenSitzplanModal");

  const closeFilmModal = document.getElementById("closeFilmModal");
  const closeVorstellungModal = document.getElementById("closeVorstellungModal");
  const closeSaalModal = document.getElementById("closeSaalModal");
  const closeSitzplanModal = document.getElementById("closeSitzplanModal");

  // Film Form
  const filmTitelInput = document.getElementById("filmTitelInput");
  const filmBeschreibungInput = document.getElementById("filmBeschreibungInput");
  const filmFskInput = document.getElementById("filmFskInput");
  const filmFormatInput = document.getElementById("filmFormatInput");
  const filmKategorieInput = document.getElementById("filmKategorieInput");
  const filmLaufzeitInput = document.getElementById("filmLaufzeitInput");
  const filmPreisInput = document.getElementById("filmPreisInput");
  const filmSaveBtn = document.getElementById("filmSaveBtn");

  // Vorstellung Form
  const vorstellungFilmSelect = document.getElementById("vorstellungFilmSelect");
  const vorstellungDatumInput = document.getElementById("vorstellungDatumInput");
  const vorstellungZeitInput = document.getElementById("vorstellungZeitInput");
  const vorstellungSaalInput = document.getElementById("vorstellungSaalInput");
  const vorstellungSaveBtn = document.getElementById("vorstellungSaveBtn");

  // Saal Form
  const saalNameInput = document.getElementById("saalNameInput");
  const saalReihenInput = document.getElementById("saalReihenInput");
  const saalSitzeInput = document.getElementById("saalSitzeInput");
  const saalLogeInput = document.getElementById("saalLogeInput");
  const saalSaveBtn = document.getElementById("saalSaveBtn");

  // Sitzplan Form
  const anzahlReihenInput = document.getElementById("anzahlReihenInput");
  const sitzeProReiheInput = document.getElementById("sitzeProReiheInput");
  const prozentLogeInput = document.getElementById("prozentLogeInput");
  const sitzplanSaveBtn = document.getElementById("sitzplanSaveBtn");

  // ============================
  // STATE
  // ============================
  let movies = [];
  let shows = [];
  let halls = [];
  let currentMovieId = null;

  // ============================
  // API helpers (POST kann Text ODER JSON)
  // ============================
  async function apiGet(path) {
    const res = await fetch(API_BASE + path);
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`GET ${path} fehlgeschlagen (${res.status}) ${txt}`);
    }
    return res.json();
  }

  async function apiPostAny(path, body) {
    const res = await fetch(API_BASE + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text().catch(() => "");
    if (!res.ok) {
      throw new Error(`POST ${path} fehlgeschlagen (${res.status}) ${text}`);
    }

    try {
      return text ? JSON.parse(text) : { ok: true };
    } catch {
      return { ok: true, message: text };
    }
  }

  async function apiDelete(path) {
    const res = await fetch(API_BASE + path, { method: "DELETE" });
    const txt = await res.text().catch(() => "");
    if (!res.ok) throw new Error(`DELETE ${path} fehlgeschlagen (${res.status}) ${txt}`);
    return txt;
  }

  // ============================
  // Modal helpers
  // ============================
  function openModal(which) {
    modalOverlay?.classList.remove("hidden");
    modalFilm?.classList.add("hidden");
    modalVorstellung?.classList.add("hidden");
    modalSaal?.classList.add("hidden");
    modalSitzplan?.classList.add("hidden");

    if (which === "film") modalFilm?.classList.remove("hidden");
    if (which === "show") modalVorstellung?.classList.remove("hidden");
    if (which === "saal") modalSaal?.classList.remove("hidden");
    if (which === "sitzplan") modalSitzplan?.classList.remove("hidden");
  }

  function closeModal() {
    modalOverlay?.classList.add("hidden");
    modalFilm?.classList.add("hidden");
    modalVorstellung?.classList.add("hidden");
    modalSaal?.classList.add("hidden");
    modalSitzplan?.classList.add("hidden");
  }

  modalOverlay?.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  closeFilmModal?.addEventListener("click", closeModal);
  closeVorstellungModal?.addEventListener("click", closeModal);
  closeSaalModal?.addEventListener("click", closeModal);
  closeSitzplanModal?.addEventListener("click", closeModal);

  // ============================
  // Utils
  // ============================
  function formatEuroFromCents(cents) {
    const n = Number(cents || 0) / 100;
    return n.toFixed(2).replace(".", ",") + " €";
  }

  function getMovieById(id) {
    return movies.find((m) => String(m.id) === String(id)) || null;
  }

  function getShowId(show) {
    return show?.id ?? show?.vorstellungId ?? null;
  }

  function getShowFilmId(show) {
    if (show?.filmId?.id != null) return show.filmId.id;
    if (typeof show?.filmId === "number" || typeof show?.filmId === "string") return show.filmId;
    if (show?.film?.id != null) return show.film.id;
    return null;
  }

  function getShowDatumISO(show) {
    return String(show?.datum || "");
  }

  function splitZeit(iso) {
    if (!iso) return { datum: "", uhrzeit: "" };
    const cleaned = String(iso).replace(/([+-]\d{2}:\d{2}|Z)$/, "");
    if (!cleaned.includes("T")) return { datum: cleaned, uhrzeit: "" };
    const [d, t] = cleaned.split("T");
    return { datum: d, uhrzeit: (t || "").slice(0, 5) };
  }

  // Saal-Feldnamen robust auslesen
  function hallId(h) {
    return h?.saalId ?? h?.id ?? null;
  }

  function hallName(h) {
    return h?.saalname ?? h?.name ?? h?.bezeichnung ?? null;
  }

  function hallRows(h) {
    return (
      h?.reihen ??
      h?.anzahlReihen ??
      h?.rowCount ??
      h?.rows ??
      h?.anzahlSitzreihen ??   // falls so
      null
    );
  }

  function hallSeatsPerRow(h) {
    return (
      h?.plaetzePerReihe ??     // ✅ DEIN FELD!
      h?.sitzeProReihe ??
      h?.plaetzeProReihe ??
      h?.seatsPerRow ??
      h?.seatCountPerRow ??
      null
    );
  }

  function hallLogePercent(h) {
    return (
      h?.logeAnteilProzent ??   // ✅ DEIN FELD!
      h?.logeProzent ??
      h?.prozentLoge ??
      h?.logePercent ??
      h?.premiumPercent ??
      null
    );
  }


  function normalizeHallInputToId(inputText) {
    const t = String(inputText || "").trim();
    if (!t) return null;

    const numMatch = t.match(/\d+/);
    if (numMatch) return parseInt(numMatch[0], 10);

    const low = t.toLowerCase();
    const found = halls.find((h) => String(hallName(h) || "").toLowerCase() === low);
    return found ? hallId(found) : null;
  }

  // ============================
  // Sitzplan Config (localStorage)
  // ============================
  function loadSitzplanConfig() {
    try {
      const c = JSON.parse(localStorage.getItem(LS_SITZPLAN_KEY) || "null");
      if (!c) return { anzahlReihen: 6, sitzeProReihe: 10, prozentLoge: 25 };
      return {
        anzahlReihen: Number(c.anzahlReihen ?? 6),
        sitzeProReihe: Number(c.sitzeProReihe ?? 10),
        prozentLoge: Number(c.prozentLoge ?? 25),
      };
    } catch {
      return { anzahlReihen: 6, sitzeProReihe: 10, prozentLoge: 25 };
    }
  }

  function setSitzplanInputsFromConfig() {
    const cfg = loadSitzplanConfig();
    if (anzahlReihenInput) anzahlReihenInput.value = String(cfg.anzahlReihen);
    if (sitzeProReiheInput) sitzeProReiheInput.value = String(cfg.sitzeProReihe);
    if (prozentLogeInput) prozentLogeInput.value = String(cfg.prozentLoge);
  }

  function saveSitzplanConfigFromInputs() {
    const anzahlReihen = parseInt(anzahlReihenInput?.value || "", 10);
    const sitzeProReihe = parseInt(sitzeProReiheInput?.value || "", 10);
    const prozentLoge = parseInt(prozentLogeInput?.value || "", 10);

    if (!anzahlReihen || anzahlReihen < 1 || anzahlReihen > 26) {
      alert("Anzahl Reihen muss zwischen 1 und 26 liegen.");
      return false;
    }
    if (!sitzeProReihe || sitzeProReihe < 1) {
      alert("Sitze pro Reihe muss mindestens 1 sein.");
      return false;
    }
    if (isNaN(prozentLoge) || prozentLoge < 0 || prozentLoge > 100) {
      alert("Loge % muss zwischen 0 und 100 sein.");
      return false;
    }

    const cfg = { anzahlReihen, sitzeProReihe, prozentLoge };
    localStorage.setItem(LS_SITZPLAN_KEY, JSON.stringify(cfg));
    return true;
  }

  // ============================
  // Reload
  // ============================
  async function reloadAll() {
    movies = await apiGet(FILM_LIST);
    shows = await apiGet(SHOW_LIST);
    halls = await apiGet(HALL_LIST);

    renderMovieList();
    renderShowList();
    renderCalendar();
    renderHallList();
    fillVorstellungFilmSelect();
  }

  // ============================
  // Render Movies
  // ============================
  function renderMovieList() {
    if (!movieListEl) return;
    movieListEl.innerHTML = "";

    const searchText = (filmSuche?.value || "").toLowerCase().trim();
    const wantFsk = filterFsk?.value || "";
    const wantStil = (filterStil?.value || "").toLowerCase();
    const wantFormat = (filterFormat?.value || "").toUpperCase(); // ignore

    movies.forEach((movie) => {
      let visible = true;

      const filmname = String(movie.filmname ?? "").toLowerCase();
      const kategorie = String(movie.kategorie ?? "").toLowerCase();
      const fskStr = String(movie.fsk ?? "");

      if (wantFsk && fskStr !== wantFsk) visible = false;
      if (wantStil && kategorie !== wantStil) visible = false;
      if (searchText && !filmname.includes(searchText)) visible = false;
      if (wantFormat) { /* ignore */ }

      if (!visible) return;

      const li = document.createElement("li");
      li.classList.add("movie-item");
      li.dataset.movieId = String(movie.id);
      if (String(movie.id) === String(currentMovieId)) li.classList.add("selected");

      const row = document.createElement("div");
      row.classList.add("movie-row");

      const infoDiv = document.createElement("div");
      infoDiv.classList.add("movie-info");

      const titleDiv = document.createElement("div");
      titleDiv.classList.add("movie-title");
      titleDiv.textContent = `${movie.filmname ?? "Ohne Titel"} (ID: ${movie.id})`;

      const metaDiv = document.createElement("div");
      metaDiv.classList.add("movie-meta");
      metaDiv.innerHTML = `FSK: ${movie.fsk ?? "-"} • Kategorie: ${movie.kategorie ?? "-"} • Preis: ${formatEuroFromCents(movie.basispreis)}`;

      infoDiv.appendChild(titleDiv);
      infoDiv.appendChild(metaDiv);

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "Löschen";
      deleteBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        if (!confirm(`Film "${movie.filmname ?? movie.id}" löschen?`)) return;
        try {
          await apiDelete(FILM_DELETE(movie.id));
          if (String(currentMovieId) === String(movie.id)) currentMovieId = null;
          await reloadAll();
        } catch (err) {
          console.error(err);
          alert("Film löschen fehlgeschlagen.\n\n" + err.message);
        }
      });

      row.appendChild(infoDiv);
      row.appendChild(deleteBtn);
      li.appendChild(row);

      li.addEventListener("click", () => {
        currentMovieId = movie.id;
        renderMovieList();
        renderShowList();
        renderCalendar();
      });

      movieListEl.appendChild(li);
    });

    if (!movies.length) {
      const li = document.createElement("li");
      li.textContent = "Keine Filme in der Datenbank.";
      movieListEl.appendChild(li);
    }
  }

  // ============================
  // Render Shows
  // ============================
  function renderShowList() {
    if (!vorstellungenTbody) return;
    vorstellungenTbody.innerHTML = "";

    let filteredShows = shows;
    if (currentMovieId != null) {
      filteredShows = shows.filter((s) => String(getShowFilmId(s)) === String(currentMovieId));
    }

    if (!filteredShows.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 5;
      td.textContent = "Keine Vorstellungen vorhanden.";
      tr.appendChild(td);
      vorstellungenTbody.appendChild(tr);
      return;
    }

    filteredShows
      .sort((a, b) => String(getShowDatumISO(a)).localeCompare(String(getShowDatumISO(b))))
      .forEach((show) => {
        const sid = getShowId(show);
        const filmId = getShowFilmId(show);
        const movie = getMovieById(filmId);

        const { datum, uhrzeit } = splitZeit(getShowDatumISO(show));

        // Saal anzeigen
        const backendSaalId = show?.saalId?.saalId ?? show?.saalId?.id ?? show?.saalId ?? null;
        const hallObj = backendSaalId != null ? halls.find(h => String(hallId(h)) === String(backendSaalId)) : null;
        const saalText = hallObj ? (hallName(hallObj) || `Saal ${backendSaalId}`) : (backendSaalId != null ? `Saal ${backendSaalId}` : "-");

        const tr = document.createElement("tr");
        const tdDatum = document.createElement("td");
        const tdFilm = document.createElement("td");
        const tdZeit = document.createElement("td");
        const tdSaal = document.createElement("td");
        const tdAktion = document.createElement("td");

        tdDatum.textContent = datum || "-";
        tdFilm.textContent = movie ? movie.filmname : (filmId ? `Film ID ${filmId}` : "Unbekannt");
        tdZeit.textContent = uhrzeit || "-";
        tdSaal.textContent = saalText;

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "Löschen";
        deleteBtn.addEventListener("click", async () => {
          if (sid == null) return alert("Vorstellung-ID fehlt.");
          if (!confirm(`Vorstellung (ID: ${sid}) löschen?`)) return;
          try {
            await apiDelete(SHOW_DELETE(sid));
            await reloadAll();
          } catch (err) {
            console.error(err);
            alert("Vorstellung löschen fehlgeschlagen.\n\n" + err.message);
          }
        });

        tdAktion.appendChild(deleteBtn);

        tr.appendChild(tdDatum);
        tr.appendChild(tdFilm);
        tr.appendChild(tdZeit);
        tr.appendChild(tdSaal);
        tr.appendChild(tdAktion);

        vorstellungenTbody.appendChild(tr);
      });
  }

  // ============================
  // Render Halls (ROBUST)
  // ============================
  function renderHallList() {
    if (!saeleTbody) return;
    saeleTbody.innerHTML = "";

    if (!halls.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 5;
      td.textContent = "Keine Säle vorhanden.";
      tr.appendChild(td);
      saeleTbody.appendChild(tr);
      return;
    }

    halls.forEach((h) => {
      const id = hallId(h);
      const name = hallName(h) || `Saal ${id ?? "?"}`;

      const rows = hallRows(h);
      const seats = hallSeatsPerRow(h);
      const loge = hallLogePercent(h);

      const tr = document.createElement("tr");

      const tdName = document.createElement("td");
      tdName.textContent = name;

      const tdRows = document.createElement("td");
      tdRows.textContent = rows != null ? String(rows) : "-";

      const tdSeats = document.createElement("td");
      tdSeats.textContent = seats != null ? String(seats) : "-";

      const tdLoge = document.createElement("td");
      tdLoge.textContent = loge != null ? `${loge}%` : "-";

      const tdAction = document.createElement("td");
      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.classList.add("delete-btn");
      delBtn.textContent = "Löschen";
      delBtn.addEventListener("click", async () => {
        if (id == null) return alert("Saal-ID fehlt.");
        if (!confirm(`Saal "${name}" (ID: ${id}) löschen?`)) return;
        try {
          await apiDelete(HALL_DELETE(id));
          await reloadAll();
        } catch (e) {
          console.error(e);
          alert("Saal löschen fehlgeschlagen.\n\n" + e.message);
        }
      });
      tdAction.appendChild(delBtn);

      tr.appendChild(tdName);
      tr.appendChild(tdRows);
      tr.appendChild(tdSeats);
      tr.appendChild(tdLoge);
      tr.appendChild(tdAction);

      saeleTbody.appendChild(tr);
    });
  }

  // ============================
  // Calendar
  // ============================
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  function getMonatsName(m) {
    const arr = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
    return arr[m] || "";
  }

  function renderCalendar() {
    if (!kalenderBody || !kalMonatLabel) return;

    kalenderBody.innerHTML = "";
    kalMonatLabel.textContent = `${getMonatsName(currentMonth)} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startWochentag = (firstDay.getDay() + 6) % 7;
    const tageImMonat = lastDay.getDate();

    let relevantShows = shows;
    if (currentMovieId != null) {
      relevantShows = shows.filter((s) => String(getShowFilmId(s)) === String(currentMovieId));
    }

    const map = {};
    relevantShows.forEach((show) => {
      const { datum, uhrzeit } = splitZeit(getShowDatumISO(show));
      if (!datum) return;
      if (!map[datum]) map[datum] = [];
      map[datum].push({ show, uhrzeit });
    });

    let dayNr = 1;
    for (let r = 0; r < 6; r++) {
      const tr = document.createElement("tr");

      for (let c = 0; c < 7; c++) {
        const td = document.createElement("td");

        if ((r === 0 && c < startWochentag) || dayNr > tageImMonat) {
          td.classList.add("kalender-empty");
        } else {
          const daySpan = document.createElement("span");
          daySpan.classList.add("tag-nr");
          daySpan.textContent = dayNr;
          td.appendChild(daySpan);

          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2,"0")}-${String(dayNr).padStart(2,"0")}`;
          const items = map[dateStr] || [];

          items.forEach(({ show, uhrzeit }) => {
            const filmId = getShowFilmId(show);
            const movie = getMovieById(filmId);

            const ev = document.createElement("span");
            ev.classList.add("kal-event");
            ev.textContent = `${uhrzeit || "--:--"} • ${(movie?.filmname || "Unbekannt")}`;
            td.appendChild(ev);
          });

          dayNr++;
        }

        tr.appendChild(td);
      }
      kalenderBody.appendChild(tr);
    }
  }

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

  btnViewList?.addEventListener("click", () => setView("list"));
  btnViewCalendar?.addEventListener("click", () => setView("calendar"));

  // ============================
  // Open modals
  // ============================
  btnOpenFilmModal?.addEventListener("click", () => {
    filmTitelInput.value = "";
    filmBeschreibungInput.value = "";
    filmFskInput.value = "";
    filmFormatInput.value = "";
    filmKategorieInput.value = "";
    filmLaufzeitInput.value = "";
    filmPreisInput.value = "";
    openModal("film");
  });

  btnOpenVorstellungModal?.addEventListener("click", () => {
    fillVorstellungFilmSelect();
    vorstellungDatumInput.value = "";
    vorstellungZeitInput.value = "";
    vorstellungSaalInput.value = "";
    openModal("show");
  });

  btnOpenSitzplanModal?.addEventListener("click", () => {
    setSitzplanInputsFromConfig();
    openModal("sitzplan");
  });

  btnOpenSaalModal?.addEventListener("click", () => {
    // Default aus Sitzplan übernehmen
    const cfg = loadSitzplanConfig();
    saalNameInput.value = "";
    saalReihenInput.value = String(cfg.anzahlReihen);
    saalSitzeInput.value = String(cfg.sitzeProReihe);
    saalLogeInput.value = String(cfg.prozentLoge);
    openModal("saal");
  });

  // ============================
  // Sitzplan speichern (localStorage)
  // ============================
  sitzplanSaveBtn?.addEventListener("click", () => {
    if (saveSitzplanConfigFromInputs()) {
      alert("Sitzplan-Konfiguration gespeichert!");
      closeModal();
    }
  });

  // ============================
  // SAVE FILM
  // ============================
  filmSaveBtn?.addEventListener("click", async () => {
    const filmname = filmTitelInput.value.trim();
    const beschreibung = filmBeschreibungInput.value.trim();
    const fsk = parseInt(filmFskInput.value, 10);
    const kategorie = filmKategorieInput.value.trim() || "Allgemein";
    const filmdauer = filmLaufzeitInput.value ? parseInt(filmLaufzeitInput.value, 10) : null;
    const preisEuro = parseFloat((filmPreisInput.value || "").replace(",", "."));

    if (!filmname || isNaN(fsk) || isNaN(preisEuro)) {
      alert("Bitte mindestens Filmtitel, FSK und Preis korrekt ausfüllen.");
      return;
    }

    const body = {
      filmname,
      beschreibung,
      fsk,
      kategorie,
      basispreis: Math.round(preisEuro * 100),
      filmdauer,
      darstellungstyp: filmFormatInput?.value || null,
    };

    try {
      await apiPostAny(FILM_ADD, body);
      closeModal();
      await reloadAll();
    } catch (e) {
      console.error(e);
      alert("Film konnte nicht gespeichert werden.\n\n" + e.message);
    }
  });

  // ============================
  // Film Select füllen
  // ============================
  function fillVorstellungFilmSelect() {
    if (!vorstellungFilmSelect) return;
    vorstellungFilmSelect.innerHTML = "";

    if (!movies.length) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "Keine Filme vorhanden";
      vorstellungFilmSelect.appendChild(opt);
      vorstellungFilmSelect.disabled = true;
      return;
    }

    vorstellungFilmSelect.disabled = false;
    movies.forEach((m) => {
      const opt = document.createElement("option");
      opt.value = String(m.id);
      opt.textContent = `${m.filmname} (ID: ${m.id})`;
      if (String(m.id) === String(currentMovieId)) opt.selected = true;
      vorstellungFilmSelect.appendChild(opt);
    });
  }

  // ============================
  // SAVE VORSTELLUNG (mehrere Varianten)
  // ============================
  vorstellungSaveBtn?.addEventListener("click", async () => {
    const filmId = parseInt(vorstellungFilmSelect.value, 10);
    const datum = vorstellungDatumInput.value;
    const zeit = vorstellungZeitInput.value;
    const saalInput = vorstellungSaalInput.value.trim();

    if (isNaN(filmId) || !datum || !zeit || !saalInput) {
      alert("Bitte Film, Datum, Uhrzeit und Saal ausfüllen.");
      return;
    }

    const iso = `${datum}T${zeit}:00`;
    const saalId = normalizeHallInputToId(saalInput);

    const bodies = [
      { filmId, saalId, datum: iso },
      { filmId: { id: filmId }, saalId: saalId != null ? { id: saalId } : null, datum: iso },
      { filmId: { id: filmId }, saalId: saalId != null ? { saalId } : null, datum: iso },
    ];

    let lastErr = null;
    for (const b of bodies) {
      try {
        await apiPostAny(SHOW_ADD, b);
        closeModal();
        await reloadAll();
        return;
      } catch (e) {
        lastErr = e;
      }
    }

    console.error(lastErr);
    alert(
      "Vorstellung konnte nicht gespeichert werden.\n\n" +
      "Wahrscheinlich passt das Entity-Mapping (filmId/saalId) anders.\n" +
      "Dann bitte die Vorstellung-Entity schicken.\n\n" +
      (lastErr?.message || "")
    );
  });

  // ============================
  // SAVE SAAL (robust senden!)
  // ============================
  saalSaveBtn?.addEventListener("click", async () => {
    const name = saalNameInput.value.trim();
    const reihen = parseInt(saalReihenInput.value, 10);
    const sitzeProReihe = parseInt(saalSitzeInput.value, 10);
    const logeProzent = parseInt(saalLogeInput.value, 10);

    if (!name || !reihen || !sitzeProReihe || isNaN(logeProzent)) {
      alert("Bitte Name, Reihen, Sitze pro Reihe und Loge % korrekt ausfüllen.");
      return;
    }
    if (logeProzent < 0 || logeProzent > 100) {
      alert("Loge % muss zwischen 0 und 100 sein.");
      return;
    }

    // Wir schicken MEHRERE Feldnamen, damit es zu deiner Entity passt
    const body = {
      // Name
      saalname: name,
      name: name,
      bezeichnung: name,

      // Reihen
      reihen: reihen,
      anzahlReihen: reihen,
      rows: reihen,

      // Sitze pro Reihe
      plaetzePerReihe: sitzeProReihe,     // ✅ DEIN FELD!
      sitzeProReihe: sitzeProReihe,
      plaetzeProReihe: sitzeProReihe,
      seatsPerRow: sitzeProReihe,

      // Loge
      logeAnteilProzent: logeProzent,     // ✅ DEIN FELD!
      logeProzent: logeProzent,
      prozentLoge: logeProzent,
      logePercent: logeProzent
    };

    try {
      const resp = await apiPostAny(HALL_ADD, body);
      closeModal();
      await reloadAll();
      alert(resp?.message || "Saal gespeichert!");
    } catch (e) {
      console.error(e);
      alert("Saal konnte nicht gespeichert werden.\n\n" + e.message);
    }
  });

  // ============================
  // Filter / Suche
  // ============================
  function applyFilter() { renderMovieList(); }
  btnFilterApply?.addEventListener("click", applyFilter);
  suchBtn?.addEventListener("click", applyFilter);
  filmSuche?.addEventListener("keyup", (e) => {
    if (e.key === "Enter") applyFilter();
  });

  // ============================
  // INIT
  // ============================
  (async () => {
    setView("list");
    try {
      await reloadAll();
    } catch (e) {
      console.error(e);
      alert("Konnte Daten nicht laden.\n\nBackend erreichbar? " + API_BASE + "\n\n" + e.message);
    }
  })();
});
