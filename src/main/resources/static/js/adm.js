document.addEventListener('DOMContentLoaded', () => {
  // ============================
  // KONFIG
  // ============================
  const API_BASE = "http://localhost:4040";
  const LS_SAAL_KEY = "kino_admin_saal_map_v2";

  // ============================
  // DOM-Referenzen
  // ============================
  const movieListEl = document.getElementById('movieList');
  const vorstellungenTbody = document.getElementById('vorstellungenTbody');

  const listenView = document.getElementById('listenView');
  const kalenderView = document.getElementById('kalenderView');
  const btnViewList = document.getElementById('btnViewList');
  const btnViewCalendar = document.getElementById('btnViewCalendar');

  const kalenderBody = document.getElementById('kalenderBody');
  const kalMonatLabel = document.getElementById('kalMonatLabel');
  const kalPrev = document.getElementById('kalPrev');
  const kalNext = document.getElementById('kalNext');

  // Filter / Suche
  const filterFormat = document.getElementById('filterFormat'); // UI-only
  const filterFsk = document.getElementById('filterFsk');
  const filterStil = document.getElementById('filterStil');
  const btnFilterApply = document.getElementById('btnFilterApply');
  const filmSuche = document.getElementById('filmSuche');
  const suchBtn = document.getElementById('suchBtn');

  // Modals
  const modalOverlay = document.getElementById('modalOverlay');
  const modalFilm = document.getElementById('modalFilm');
  const modalVorstellung = document.getElementById('modalVorstellung');

  const btnOpenFilmModal = document.getElementById('btnOpenFilmModal');
  const btnOpenVorstellungModal = document.getElementById('btnOpenVorstellungModal');
  const closeFilmModal = document.getElementById('closeFilmModal');
  const closeVorstellungModal = document.getElementById('closeVorstellungModal');

  // Film-Form
  const filmTitelInput = document.getElementById('filmTitelInput');
  const filmBeschreibungInput = document.getElementById('filmBeschreibungInput');
  const filmFskInput = document.getElementById('filmFskInput');
  const filmFormatInput = document.getElementById('filmFormatInput'); // wir nutzen das als darstellungstyp für Vorstellung
  const filmKategorieInput = document.getElementById('filmKategorieInput');
  const filmPreisInput = document.getElementById('filmPreisInput');
  const filmSaveBtn = document.getElementById('filmSaveBtn');

  // Vorstellung-Form
  const vorstellungFilmSelect = document.getElementById('vorstellungFilmSelect');
  const vorstellungDatumInput = document.getElementById('vorstellungDatumInput');
  const vorstellungZeitInput = document.getElementById('vorstellungZeitInput');
  const vorstellungSaalInput = document.getElementById('vorstellungSaalInput');
  const vorstellungSaveBtn = document.getElementById('vorstellungSaveBtn');

  // ============================
  // STATE
  // ============================
  let movies = [];
  let shows = [];
  let currentMovieId = null;

  // ============================
  // localStorage Saal-Map
  // ============================
  function loadSaalMap() {
    try { return JSON.parse(localStorage.getItem(LS_SAAL_KEY) || "{}"); }
    catch { return {}; }
  }
  function saveSaalMap(map) {
    localStorage.setItem(LS_SAAL_KEY, JSON.stringify(map));
  }
  function saalKeyByShowId(showId) {
    return `showId:${showId}`;
  }
  function saalKeyByFilmDatum(filmId, iso) {
    return `film:${filmId}|datum:${iso}`;
  }

  // ============================
  // API HELPERS
  // ============================
  async function apiGet(path) {
    const res = await fetch(API_BASE + path);
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`GET ${path} fehlgeschlagen (${res.status}) ${txt}`);
    }
    return res.json();
  }

  async function apiPost(path, body) {
    const res = await fetch(API_BASE + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`POST ${path} fehlgeschlagen (${res.status}) ${txt}`);
    }
    return res.json();
  }

  async function apiDelete(path) {
    const res = await fetch(API_BASE + path, { method: "DELETE" });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`DELETE ${path} fehlgeschlagen (${res.status}) ${txt}`);
    }
  }

  async function reloadAll() {
    movies = await apiGet("/api/filme");
    shows = await apiGet("/api/vorstellungen");
    renderMovieList();
    renderShowList();
    renderCalendar();
    fillVorstellungFilmSelect();
  }

  // ============================
  // Helpers
  // ============================
  function openModal(which) {
    modalOverlay?.classList.remove('hidden');
    modalFilm?.classList.add('hidden');
    modalVorstellung?.classList.add('hidden');
    if (which === 'film') modalFilm?.classList.remove('hidden');
    if (which === 'show') modalVorstellung?.classList.remove('hidden');
  }

  function closeModal() {
    modalOverlay?.classList.add('hidden');
    modalFilm?.classList.add('hidden');
    modalVorstellung?.classList.add('hidden');
  }

  function formatEuroFromCents(cents) {
    const n = Number(cents || 0) / 100;
    return n.toFixed(2).replace('.', ',') + ' €';
  }

  function getMovieById(id) {
    return movies.find(m => String(m.id) === String(id)) || null;
  }

  // ✅ WICHTIG: Vorstellung-ID robust (Backend kann id oder vorstellungId liefern)
  function getShowId(show) {
    return show?.id ?? show?.vorstellungId ?? null;
  }

  function getShowFilmId(show) {
    // Backend Entity hat "filmId" als ManyToOne Film
    if (show?.filmId?.id != null) return show.filmId.id;
    if (show?.filmId?.filmId != null) return show.filmId.filmId;
    if (typeof show?.filmId === "number" || typeof show?.filmId === "string") return show.filmId;

    // Falls mal "film" kommt
    if (show?.film?.id != null) return show.film.id;
    if (show?.film?.filmId != null) return show.film.filmId;

    return null;
  }

  function getShowSaalId(show) {
    // Backend Entity hat "saalId" als ManyToOne Saal
    if (show?.saalId?.id != null) return show.saalId.id;
    if (show?.saalId?.saalId != null) return show.saalId.saalId;
    if (typeof show?.saalId === "number" || typeof show?.saalId === "string") return show.saalId;

    // Falls mal "saal" kommt
    if (show?.saal?.id != null) return show.saal.id;
    if (show?.saal?.saalId != null) return show.saal.saalId;

    return null;
  }

  function getShowDatumISO(show) {
    // Backend Entity Feld heißt "datum"
    return String(show?.datum || show?.zeit || "");
  }

  function splitZeit(iso) {
    if (!iso) return { datum: "", uhrzeit: "" };
    const s = String(iso).replace(/([+-]\d{2}:\d{2}|Z)$/, ""); // Offset entfernen
    if (!s.includes("T")) return { datum: s, uhrzeit: "" };
    const [d, t] = s.split("T");
    return { datum: d, uhrzeit: (t || "").slice(0, 5) };
  }

  function extractFirstNumber(text) {
    const m = String(text || "").match(/\d+/);
    return m ? parseInt(m[0], 10) : NaN;
  }

  // ✅ Saal immer finden: erst Backend saalId, dann LS showId, dann LS film+datum
  function resolveSaalText(show) {
    const backendSaal = getShowSaalId(show);
    if (backendSaal != null) return `Saal ${backendSaal}`;

    const map = loadSaalMap();

    const sid = getShowId(show);
    if (sid != null) {
      const v = map[saalKeyByShowId(sid)];
      if (v) return v;
    }

    const filmId = getShowFilmId(show);
    const iso = getShowDatumISO(show);
    if (filmId != null && iso) {
      const v2 = map[saalKeyByFilmDatum(filmId, iso)];
      if (v2) return v2;
    }

    return "-";
  }

  // ============================
  // Filme rendern / filtern
  // ============================
  function renderMovieList() {
    if (!movieListEl) return;
    movieListEl.innerHTML = '';

    const searchText = (filmSuche?.value || '').toLowerCase().trim();
    const wantFsk = (filterFsk?.value || '');
    const wantStil = (filterStil?.value || '').toLowerCase();
    const wantFormat = (filterFormat?.value || '').toUpperCase(); // UI-only -> ignorieren

    movies.forEach(movie => {
      let visible = true;

      const filmname = String(movie.filmname ?? "").toLowerCase();
      const kategorie = String(movie.kategorie ?? "").toLowerCase();
      const fskStr = String(movie.fsk ?? "");

      if (wantFsk && fskStr !== wantFsk) visible = false;
      if (wantStil && kategorie !== wantStil) visible = false;
      if (searchText && !filmname.includes(searchText)) visible = false;
      if (wantFormat) { /* ignorieren */ }

      if (!visible) return;

      const li = document.createElement('li');
      li.classList.add('movie-item');
      li.dataset.movieId = String(movie.id);

      if (String(movie.id) === String(currentMovieId)) li.classList.add('selected');

      const row = document.createElement('div');
      row.classList.add('movie-row');

      const infoDiv = document.createElement('div');
      infoDiv.classList.add('movie-info');

      const titleDiv = document.createElement('div');
      titleDiv.classList.add('movie-title');
      titleDiv.textContent = `${movie.filmname ?? "Ohne Titel"} (ID: ${movie.id})`;

      const metaDiv = document.createElement('div');
      metaDiv.classList.add('movie-meta');
      metaDiv.innerHTML =
        `FSK: ${movie.fsk ?? "-"} • Kategorie: ${movie.kategorie ?? "-"} • Preis: ${formatEuroFromCents(movie.basispreis)}`;

      infoDiv.appendChild(titleDiv);
      infoDiv.appendChild(metaDiv);

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.classList.add('delete-btn');
      deleteBtn.textContent = 'Löschen';
      deleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!confirm(`Film "${movie.filmname ?? movie.id}" löschen?`)) return;
        try {
          await apiDelete(`/api/filme/${movie.id}`);
          if (String(currentMovieId) === String(movie.id)) currentMovieId = null;
          await reloadAll();
        } catch (err) {
          console.error(err);
          alert("Film löschen fehlgeschlagen.");
        }
      });

      row.appendChild(infoDiv);
      row.appendChild(deleteBtn);
      li.appendChild(row);

      li.addEventListener('click', () => {
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
  // Vorstellungen rendern
  // ============================
  function renderShowList() {
    if (!vorstellungenTbody) return;
    vorstellungenTbody.innerHTML = '';

    let filteredShows = shows;
    if (currentMovieId != null) {
      filteredShows = shows.filter(s => String(getShowFilmId(s)) === String(currentMovieId));
    }

    if (!filteredShows.length) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 5;
      td.textContent = 'Keine Vorstellungen vorhanden.';
      tr.appendChild(td);
      vorstellungenTbody.appendChild(tr);
      return;
    }

    filteredShows
      .sort((a, b) => String(getShowDatumISO(a)).localeCompare(String(getShowDatumISO(b))))
      .forEach(show => {
        const sid = getShowId(show);
        const filmId = getShowFilmId(show);
        const movie = getMovieById(filmId);

        const iso = getShowDatumISO(show);
        const { datum, uhrzeit } = splitZeit(iso);

        const saalText = resolveSaalText(show);

        const tr = document.createElement('tr');

        const tdDatum = document.createElement('td');
        const tdFilm = document.createElement('td');
        const tdZeit = document.createElement('td');
        const tdSaal = document.createElement('td');
        const tdAktion = document.createElement('td');

        tdDatum.textContent = datum || "-";
        tdFilm.textContent = movie
          ? `${movie.filmname} (ID: ${movie.id})`
          : (filmId ? `Film ID ${filmId}` : "Unbekannt");

        tdZeit.textContent = uhrzeit || "-";
        tdSaal.textContent = saalText;

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Löschen';
        deleteBtn.addEventListener('click', async () => {
          if (sid == null) {
            alert("Kann nicht löschen: Vorstellung-ID fehlt (id/vorstellungId).");
            return;
          }
          if (!confirm(`Vorstellung (ID: ${sid}) löschen?`)) return;
          try {
            await apiDelete(`/api/vorstellungen/${sid}`);
            await reloadAll();
          } catch (err) {
            console.error(err);
            alert("Vorstellung löschen fehlgeschlagen.");
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
  // Kalender
  // ============================
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  function getMonatsName(monthIndex) {
    const namen = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    return namen[monthIndex] || '';
  }

  function renderCalendar() {
    if (!kalenderBody || !kalMonatLabel) return;

    kalenderBody.innerHTML = '';
    kalMonatLabel.textContent = `${getMonatsName(currentMonth)} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startWochentag = (firstDay.getDay() + 6) % 7;
    const tageImMonat = lastDay.getDate();

    let relevantShows = shows;
    if (currentMovieId != null) {
      relevantShows = shows.filter(s => String(getShowFilmId(s)) === String(currentMovieId));
    }

    const mapDatumZuShows = {};
    relevantShows.forEach(show => {
      const iso = getShowDatumISO(show);
      const { datum, uhrzeit } = splitZeit(iso);
      if (!datum) return;
      if (!mapDatumZuShows[datum]) mapDatumZuShows[datum] = [];
      mapDatumZuShows[datum].push({ show, uhrzeit });
    });

    let aktuellerTag = 1;
    for (let zeile = 0; zeile < 6; zeile++) {
      const tr = document.createElement('tr');

      for (let wochentag = 0; wochentag < 7; wochentag++) {
        const td = document.createElement('td');

        if ((zeile === 0 && wochentag < startWochentag) || aktuellerTag > tageImMonat) {
          td.classList.add('kalender-empty');
        } else {
          const day = aktuellerTag;
          const daySpan = document.createElement('span');
          daySpan.classList.add('tag-nr');
          daySpan.textContent = day;
          td.appendChild(daySpan);

          const dateStr =
            `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

          const showsForDate = mapDatumZuShows[dateStr] || [];

          showsForDate.forEach(({ show, uhrzeit }) => {
            const filmId = getShowFilmId(show);
            const movie = getMovieById(filmId);
            const saalText = resolveSaalText(show);

            const ev = document.createElement('span');
            ev.classList.add('kal-event');
            ev.textContent =
              `${uhrzeit || "--:--"} • ${saalText} • ${movie ? movie.filmname : "Unbekannt"}`;
            td.appendChild(ev);
          });

          aktuellerTag++;
        }

        tr.appendChild(td);
      }
      kalenderBody.appendChild(tr);
    }
  }

  kalPrev?.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
  });

  kalNext?.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
  });

  // ============================
  // Ansicht umschalten
  // ============================
  function setView(mode) {
    if (!listenView || !kalenderView || !btnViewList || !btnViewCalendar) return;

    if (mode === 'list') {
      listenView.classList.remove('hidden');
      kalenderView.classList.add('hidden');
      btnViewList.classList.add('active-view');
      btnViewCalendar.classList.remove('active-view');
    } else {
      listenView.classList.add('hidden');
      kalenderView.classList.remove('hidden');
      btnViewList.classList.remove('active-view');
      btnViewCalendar.classList.add('active-view');
    }
  }

  btnViewList?.addEventListener('click', () => setView('list'));
  btnViewCalendar?.addEventListener('click', () => setView('calendar'));

  // ============================
  // Modals / Form-Handling
  // ============================
  btnOpenFilmModal?.addEventListener('click', () => {
    filmTitelInput.value = '';
    filmBeschreibungInput.value = '';
    filmFskInput.value = '';
    filmFormatInput.value = '';
    filmKategorieInput.value = '';
    filmPreisInput.value = '';
    openModal('film');
  });

  btnOpenVorstellungModal?.addEventListener('click', () => {
    fillVorstellungFilmSelect();
    vorstellungDatumInput.value = '';
    vorstellungZeitInput.value = '';
    vorstellungSaalInput.value = '';
    openModal('show');
  });

  closeFilmModal?.addEventListener('click', closeModal);
  closeVorstellungModal?.addEventListener('click', closeModal);

  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // ============================
  // FILM SPEICHERN (DB)
  // ============================
  filmSaveBtn?.addEventListener('click', async () => {
    const filmname = filmTitelInput.value.trim();
    const beschreibung = filmBeschreibungInput.value.trim();
    const fsk = parseInt(filmFskInput.value, 10);
    const kategorie = filmKategorieInput.value.trim() || 'Allgemein';
    const preisEuro = parseFloat((filmPreisInput.value || '').replace(',', '.'));

    if (!filmname || isNaN(fsk) || isNaN(preisEuro)) {
      alert('Bitte mindestens Filmtitel, FSK und Preis korrekt ausfüllen.');
      return;
    }

    const body = {
      filmname,
      beschreibung,
      fsk,
      kategorie,
      basispreis: Math.round(preisEuro * 100)
    };

    try {
      await apiPost("/api/filme", body);
      closeModal();
      await reloadAll();
    } catch (e) {
      console.error(e);
      alert("Film konnte nicht gespeichert werden.");
    }
  });

  // ============================
  // Vorstellung: Film-Select füllen
  // ============================
  function fillVorstellungFilmSelect() {
    if (!vorstellungFilmSelect) return;
    vorstellungFilmSelect.innerHTML = '';

    if (!movies.length) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'Keine Filme vorhanden';
      vorstellungFilmSelect.appendChild(opt);
      vorstellungFilmSelect.disabled = true;
      return;
    }

    vorstellungFilmSelect.disabled = false;

    movies.forEach(movie => {
      const opt = document.createElement('option');
      opt.value = String(movie.id);
      opt.textContent = `${movie.filmname ?? "Film"} (ID: ${movie.id})`;
      if (String(movie.id) === String(currentMovieId)) opt.selected = true;
      vorstellungFilmSelect.appendChild(opt);
    });
  }

  // ============================
  // VORSTELLUNG SPEICHERN (DB)
  // ============================
  vorstellungSaveBtn?.addEventListener('click', async () => {
    const filmId = parseInt(vorstellungFilmSelect.value, 10);
    const datum = vorstellungDatumInput.value; // YYYY-MM-DD
    const zeit = vorstellungZeitInput.value;   // HH:MM
    const saalText = vorstellungSaalInput.value.trim();
    const darstellungstyp = (filmFormatInput?.value || "").trim() || null;

    if (isNaN(filmId) || !datum || !zeit || !saalText) {
      alert('Bitte Film, Datum, Uhrzeit und Saal ausfüllen.');
      return;
    }

    const iso = `${datum}T${zeit}:00`;
    const saalNum = extractFirstNumber(saalText);

    // ✅ Backend Entity: filmId und saalId sind ManyToOne -> als Objekt senden
    const body = {
      filmId: { id: filmId },
      saalId: isNaN(saalNum) ? null : { id: saalNum },
      darstellungstyp,
      datum: iso
    };

    try {
      const saved = await apiPost("/api/vorstellungen", body);

      // Saal zusätzlich lokal speichern (falls Backend saalId später mal fehlt)
      const map = loadSaalMap();
      const sid = getShowId(saved);
      if (sid != null) map[saalKeyByShowId(sid)] = saalText;
      map[saalKeyByFilmDatum(filmId, iso)] = saalText;
      saveSaalMap(map);

      closeModal();
      await reloadAll();
    } catch (e) {
      console.error(e);
      alert("Vorstellung konnte nicht gespeichert werden.");
    }
  });

  // ============================
  // Filter / Suche
  // ============================
  function applyFilter() {
    renderMovieList();
  }

  btnFilterApply?.addEventListener('click', applyFilter);
  suchBtn?.addEventListener('click', applyFilter);

  filmSuche?.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') applyFilter();
  });

  // ============================
  // INITIAL
  // ============================
  (async () => {
    setView('list');
    try {
      await reloadAll();
    } catch (e) {
      console.error(e);
      alert(
        "Konnte Daten nicht laden.\n\n" +
        "Backend erreichbar? " + API_BASE
      );
    }
  })();
});
