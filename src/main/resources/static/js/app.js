document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:8080";

  // ============================
  // DOM
  // ============================
  // Links: Filmliste
  const filmListeAside = document.getElementById("filmListe");
  const filmSuche = document.getElementById("filmSuche");
  const suchBtn = document.getElementById("suchBtn");

  // Auth Buttons (Topbar)
  const btnLogin = document.getElementById("Login-btn-non-autenthicated");
  const btnKonto = document.getElementById("Login-btn-autenthicated");

  // Details rechts
  const detailsWrapper = document.getElementById("detailsWrapper");
  const inhaltTitel = document.getElementById("inhaltTitel");
  const inhaltText = document.getElementById("inhaltText");
  const infoFsk = document.getElementById("infoFsk");
  const infoFormat = document.getElementById("infoFormat");
  const infoKategorie = document.getElementById("infoKategorie");
  const infoLaufzeit = document.getElementById("infoLaufzeit");
  const infoPreis = document.getElementById("infoPreis");

  // Vorstellungen Tabelle
  const vorstellungenTbody = document.getElementById("vorstellungenTbody");

  // Toggle Listen/Kalender
  const btnViewList = document.getElementById("btnViewList");
  const btnViewCalendar = document.getElementById("btnViewCalendar");
  const listenView = document.getElementById("listenView");
  const kalenderView = document.getElementById("kalenderView");

  // Kalender
  const kalMonatLabel = document.getElementById("kalMonatLabel");
  const kalPrev = document.getElementById("kalPrev");
  const kalNext = document.getElementById("kalNext");
  const kalenderBody = document.getElementById("kalenderBody");

  // Buchung Bereich + Buttons
  const buchenContainer = document.getElementById("buchen");
  const buchenBtn = document.getElementById("buchenBtn");
  const buchenBox = document.getElementById("buchenBox");
  const inhaltBox = document.getElementById("inhaltBox");
  const zurueckBtn = document.getElementById("zurueckBtn");
  const bezahlenBtn = document.getElementById("bezahlenBtn");
  const buchungVorstellungInfo = document.getElementById("buchungVorstellungInfo");

  // Sitzplan / Tickets (Buchungsbereich)
  const sitzContainer = document.getElementById("sitzContainer");
  const ausgewaehlteSitzeTxt = document.getElementById("ausgewaehlteSitze");
  const ticketsTbody = document.getElementById("ticketsTbody");
  const summeAnzeige = document.getElementById("summeAnzeige");

  // ============================
  // STATE
  // ============================
  let movies = [];
  let shows = [];
  let currentMovieId = null;
  let selectedShow = null;

  // Sitz-Status aus Backend
  let seats = [];          // vom Backend
  let selectedSeats = [];  // { sitzId, reihe, platzNr, bereich }

  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  // ============================
  // HELPERS
  // ============================
  async function apiGet(path) {
    const res = await fetch(API_BASE + path);
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`GET ${path} fehlgeschlagen (${res.status}) ${t}`);
    }
    return res.json();
  }

  function isLoggedIn() {
    try {
      const user = JSON.parse(localStorage.getItem("kino_user") || "null");
      return !!user;
    } catch {
      return false;
    }
  }

  function updateAuthButtons() {
    const logged = isLoggedIn();
    if (btnLogin) btnLogin.style.display = logged ? "none" : "inline-block";
    if (btnKonto) btnKonto.style.display = logged ? "inline-block" : "none";
  }

  // ✅ Buchung: sichtbar nur wenn eingeloggt, aktiv nur wenn Vorstellung gewählt
  function updateBuchenUI() {
    const logged = isLoggedIn();
    if (!buchenContainer || !buchenBtn) return;

    if (!logged) {
      buchenContainer.classList.add("hidden");
      buchenBtn.disabled = true;
      return;
    }

    buchenContainer.classList.remove("hidden");
    buchenBtn.disabled = !selectedShow;
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

  function getMovieById(id) {
    return movies.find(m => String(m.id) === String(id)) || null;
  }

  function getFilmname(movie) {
    return movie?.filmname ?? movie?.titel ?? "Ohne Titel";
  }

  function getShowFilmId(show) {
    if (show?.filmId?.id != null) return show.filmId.id;
    if (show?.film?.id != null) return show.film.id;
    if (typeof show?.filmId === "number" || typeof show?.filmId === "string") return show.filmId;
    return null;
  }

  function getShowId(show) {
    return show?.id ?? null;
  }

  function getShowSaalId(show) {
    if (show?.saalId?.id != null) return show.saalId.id;
    if (typeof show?.saalId === "number" || typeof show?.saalId === "string") return show.saalId;
    if (show?.saal?.id != null) return show.saal.id;
    return null;
  }

  function getShowSaalText(show) {
    const sid = getShowSaalId(show);
    return sid != null ? `Saal ${sid}` : "-";
  }

  function getMonatsName(monthIndex) {
    const namen = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
    return namen[monthIndex] || "";
  }

  // ============================
  // RENDER: Film Liste
  // ============================
  function renderMovieList() {
    if (!filmListeAside) return;

    const ul = filmListeAside.querySelector("ul");
    if (!ul) return;

    ul.innerHTML = "";

    const search = (filmSuche?.value || "").toLowerCase().trim();
    const filtered = movies.filter(m => {
      const name = String(getFilmname(m)).toLowerCase();
      return !search || name.includes(search);
    });

    if (!filtered.length) {
      const li = document.createElement("li");
      li.textContent = "Keine Filme vorhanden.";
      ul.appendChild(li);
      return;
    }

    filtered.forEach(movie => {
      const li = document.createElement("li");
      li.textContent = getFilmname(movie);
      li.classList.toggle("aktiv", String(movie.id) === String(currentMovieId));
      li.addEventListener("click", () => selectMovie(movie.id));
      ul.appendChild(li);
    });
  }

  // ============================
  // RENDER: Details rechts
  // ============================
  function renderDetailsForMovie(movieId) {
    const movie = getMovieById(movieId);
    if (!movie) return;

    if (inhaltTitel) inhaltTitel.textContent = getFilmname(movie);
    if (inhaltText) inhaltText.textContent = movie.beschreibung || "";
    if (infoFsk) infoFsk.textContent = movie.fsk ?? "-";
    if (infoKategorie) infoKategorie.textContent = movie.kategorie ?? "-";

    if (infoLaufzeit) {
      const d = movie.filmdauer ?? movie.laufzeit ?? null;
      infoLaufzeit.textContent = d ? `${d} Min` : "k.A.";
    }

    if (infoPreis) infoPreis.textContent = formatEuroFromCents(movie.basispreis ?? 0);

    if (infoFormat) {
      // falls Backend kein format liefert -> "-"
      infoFormat.textContent = movie.darstellungstyp ?? "-";
    }

    detailsWrapper?.classList.remove("hidden");
  }

  // ============================
  // RENDER: Vorstellungen Tabelle
  // ============================
  function renderShowList() {
    if (!vorstellungenTbody) return;

    vorstellungenTbody.innerHTML = "";
    selectedShow = null;
    updateBuchenUI();

    const relevant = shows
      .filter(s => String(getShowFilmId(s)) === String(currentMovieId))
      .sort((a, b) => String(a.datum || "").localeCompare(String(b.datum || "")));

    if (!relevant.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 3;
      td.textContent = "Keine Vorstellungen vorhanden.";
      tr.appendChild(td);
      vorstellungenTbody.appendChild(tr);
      return;
    }

    relevant.forEach(show => {
      const { datum, uhrzeit } = splitISO(show.datum);
      const saalText = getShowSaalText(show);

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
        [...vorstellungenTbody.querySelectorAll("tr")].forEach(x => x.classList.remove("selected-show"));
        tr.classList.add("selected-show");

        selectedShow = show;
        updateBuchenUI();

        const movie = getMovieById(currentMovieId);
        if (buchungVorstellungInfo) {
          buchungVorstellungInfo.textContent =
            `Ausgewählte Vorstellung: ${getFilmname(movie)} – ${datum}, ${uhrzeit} Uhr, ${saalText}`;
        }
      });

      vorstellungenTbody.appendChild(tr);
    });
  }

  // ============================
  // RENDER: Kalender
  // ============================
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
          const showsForDate = (map[dateStr] || []).sort((a, b) => String(a.uhrzeit).localeCompare(String(b.uhrzeit)));

          showsForDate.forEach(({ uhrzeit, show }) => {
            const saalText = getShowSaalText(show);
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

  // ============================
  // VIEW TOGGLE
  // ============================
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

  // ============================
  // SELECT FILM
  // ============================
  function selectMovie(movieId) {
    currentMovieId = movieId;
    selectedShow = null;

    renderMovieList();
    renderDetailsForMovie(movieId);
    renderShowList();
    renderCalendar();
    setView("list");

    updateBuchenUI();
  }

  // ============================
  // SITZPLAN: Laden + Rendern
  // ============================
  async function loadSeatStatusForSelectedShow() {
    const vorstellungId = getShowId(selectedShow);
    const saalId = getShowSaalId(selectedShow);

    if (!vorstellungId || !saalId) {
      throw new Error("Vorstellung oder Saal-ID fehlt (selectedShow.id / selectedShow.saalId.id)");
    }

    const data = await apiGet(`/api/sitze/status/${vorstellungId}/${saalId}`);
    seats = Array.isArray(data) ? data : [];
    selectedSeats = [];
  }

  function renderSelectedSeatsText() {
    if (!ausgewaehlteSitzeTxt) return;
    if (!selectedSeats.length) {
      ausgewaehlteSitzeTxt.textContent = "keine";
      return;
    }
    ausgewaehlteSitzeTxt.textContent = selectedSeats
      .map(s => `${s.reihe}${s.platzNr} (${s.bereich})`)
      .join(", ");
  }

  function renderTicketsTable() {
    if (!ticketsTbody) return;
    ticketsTbody.innerHTML = "";

    if (!selectedSeats.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 4;
      td.textContent = "Keine Plätze ausgewählt.";
      tr.appendChild(td);
      ticketsTbody.appendChild(tr);
      return;
    }

    selectedSeats.forEach(seat => {
      const tr = document.createElement("tr");

      const tdPlatz = document.createElement("td");
      tdPlatz.textContent = `${seat.reihe}${seat.platzNr}`;

      const tdBereich = document.createElement("td");
      tdBereich.textContent = seat.bereich || "-";

      const tdErm = document.createElement("td");
      tdErm.textContent = "-";

      const tdPreis = document.createElement("td");
      tdPreis.textContent = "-";

      tr.appendChild(tdPlatz);
      tr.appendChild(tdBereich);
      tr.appendChild(tdErm);
      tr.appendChild(tdPreis);

      ticketsTbody.appendChild(tr);
    });
  }

  function toggleSeat(seatObj, btn) {
    const key = seatObj.sitzId ?? seatObj.id ?? `${seatObj.reihe}-${seatObj.platzNr}`;
    const idx = selectedSeats.findIndex(x => (x.sitzId ?? x.id) === key);

    if (idx >= 0) {
      selectedSeats.splice(idx, 1);
      btn.classList.remove("gewaehlt");
    } else {
      selectedSeats.push({
        sitzId: key,
        reihe: seatObj.reihe,
        platzNr: seatObj.platzNr,
        bereich: seatObj.bereich
      });
      btn.classList.add("gewaehlt");
    }

    renderSelectedSeatsText();
    renderTicketsTable();
  }

  function renderSeatPlan() {
    if (!sitzContainer) return;

    sitzContainer.innerHTML = "";

    if (!seats.length) {
      sitzContainer.textContent = "Keine Sitzplätze gefunden.";
      renderSelectedSeatsText();
      renderTicketsTable();
      return;
    }

    // Gruppieren nach Reihe
    const map = {};
    seats.forEach(s => {
      const row = s.reihe || "?";
      if (!map[row]) map[row] = [];
      map[row].push(s);
    });

    const rows = Object.keys(map).sort((a, b) => a.localeCompare(b));

    rows.forEach(rowName => {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("sitzreihe");

      const label = document.createElement("span");
      label.classList.add("sitzreihe-label");
      label.textContent = rowName;
      rowDiv.appendChild(label);

      map[rowName]
        .sort((a, b) => (a.platzNr ?? 0) - (b.platzNr ?? 0))
        .forEach(seatObj => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.classList.add("sitz");

          const bereich = String(seatObj.bereich || "").toLowerCase();
          if (bereich.includes("loge")) btn.classList.add("premium");
          else btn.classList.add("standard");

          btn.textContent = seatObj.platzNr ?? "?";

          if (seatObj.belegt) {
            btn.classList.add("belegt");
            btn.disabled = true;
          } else {
            btn.addEventListener("click", () => toggleSeat(seatObj, btn));
          }

          rowDiv.appendChild(btn);
        });

      sitzContainer.appendChild(rowDiv);
    });

    renderSelectedSeatsText();
    renderTicketsTable();
  }

  // ============================
  // LOAD DATA
  // ============================
  async function reloadAll() {
    movies = await apiGet("/api/filme/list");
    shows = await apiGet("/api/vorstellungen/list");

    renderMovieList();

    if (movies.length && currentMovieId == null) {
      selectMovie(movies[0].id);
    } else if (currentMovieId != null) {
      selectMovie(currentMovieId);
    } else {
      detailsWrapper?.classList.add("hidden");
      selectedShow = null;
      updateBuchenUI();
    }
  }

  // ============================
  // EVENTS
  // ============================
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

  suchBtn?.addEventListener("click", renderMovieList);
  filmSuche?.addEventListener("keyup", (e) => {
    if (e.key === "Enter") renderMovieList();
  });

  // ✅ Buchen: lädt Sitzplan aus Backend
  buchenBtn?.addEventListener("click", async () => {
    if (!isLoggedIn()) {
      alert("Bitte zuerst einloggen.");
      return;
    }
    if (!selectedShow) {
      alert("Bitte zuerst eine Vorstellung auswählen.");
      return;
    }

    try {
      await loadSeatStatusForSelectedShow();
      renderSeatPlan();

      inhaltBox?.classList.add("hidden");
      buchenBox?.classList.remove("hidden");
    } catch (e) {
      console.error(e);
      alert("Sitzplan konnte nicht geladen werden: " + (e.message || e));
    }
  });

  zurueckBtn?.addEventListener("click", () => {
    buchenBox?.classList.add("hidden");
    inhaltBox?.classList.remove("hidden");
  });

  bezahlenBtn?.addEventListener("click", () => {
    alert("Buchung übernommen (Demo).");
    selectedSeats = [];
    renderSelectedSeatsText();
    renderTicketsTable();
    if (summeAnzeige) summeAnzeige.textContent = "0,00 €";
  });

  // Wenn localStorage in anderem Tab geändert wird
  window.addEventListener("storage", () => {
    updateAuthButtons();
    updateBuchenUI();
  });

  // ============================
  // INIT
  // ============================
  detailsWrapper?.classList.add("hidden");
  setView("list");
  updateAuthButtons();
  updateBuchenUI();

  // Default Tickets Table leer
  renderSelectedSeatsText();
  renderTicketsTable();

  (async () => {
    try {
      await reloadAll();
    } catch (e) {
      console.error(e);
      alert(
        "Konnte Daten nicht laden.\n\n" +
        "Backend erreichbar? " + API_BASE + "\n" +
        "Erwartete Endpoints:\n" +
        "- /api/filme/list\n" +
        "- /api/vorstellungen/list\n" +
        "- /api/sitze/status/{vorstellungId}/{saalId}"
      );
    }
  })();
});
