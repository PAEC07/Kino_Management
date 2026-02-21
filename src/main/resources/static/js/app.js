document.addEventListener("DOMContentLoaded", () => {
  // ============================
  // CONFIG
  // ============================
  const API_BASE = "http://localhost:8080";

  const API = {
    filmeList: "/api/filme/list",
    showsList: "/api/vorstellungen/list",
    hallsList: "/api/saal/list",
    seatStatus: (vorstellungId, saalId) => `/api/sitze/status/${vorstellungId}/${saalId}`,
    checkout: "/api/buchungen/checkout",
  };

  // Backend-Logik nachbauen:
  // - Film.basispreis in cents
  // - Loge: +10%
  const DISCOUNTS = {
    NONE: 1.0,
    STUDENT: 0.8, // -20%
    SENIOR: 0.85, // -15%
    CHILD: 0.7, // -30%
  };

  // ============================
  // DOM
  // ============================
  const filmListeEl = document.querySelector("#filmListe ul");
  const inhaltTitel = document.getElementById("inhaltTitel");
  const detailsWrapper = document.getElementById("detailsWrapper");

  const infoFsk = document.getElementById("infoFsk");
  const infoFormat = document.getElementById("infoFormat");
  const infoKategorie = document.getElementById("infoKategorie");
  const infoLaufzeit = document.getElementById("infoLaufzeit");
  const infoPreis = document.getElementById("infoPreis");
  const inhaltText = document.getElementById("inhaltText");

  const vorstellungenTbody = document.getElementById("vorstellungenTbody");
  const kalenderBody = document.getElementById("kalenderBody");
  const kalMonatLabel = document.getElementById("kalMonatLabel");
  const kalPrev = document.getElementById("kalPrev");
  const kalNext = document.getElementById("kalNext");

  const btnViewList = document.getElementById("btnViewList");
  const btnViewCalendar = document.getElementById("btnViewCalendar");
  const listenView = document.getElementById("listenView");
  const kalenderView = document.getElementById("kalenderView");

  const buchenBtn = document.getElementById("buchenBtn");
  const buchenBox = document.getElementById("buchenBox");
  const inhaltBox = document.getElementById("inhaltBox");
  const zurueckBtn = document.getElementById("zurueckBtn");
  const bezahlenBtn = document.getElementById("bezahlenBtn");

  const buchungVorstellungInfo = document.getElementById("buchungVorstellungInfo");
  const sitzContainer = document.getElementById("sitzContainer");

  const ticketsTbody = document.getElementById("ticketsTbody");
  const ausgewaehlteSitzeEl = document.getElementById("ausgewaehlteSitze");
  const summeAnzeige = document.getElementById("summeAnzeige");

  // ✅ NEU: Preis (Erwachsene) Anzeige im Buchungsbereich
  const preisErwachsene = document.getElementById("preisErwachsene");

  // Login/Konto Button toggling (optional)
  const loginBtnAss = document.getElementById("Login-btn-autenthicated");
  const loginBtnNon = document.getElementById("Login-btn-non-autenthicated");

  // Modal Show Info (optional in index.html vorhanden)
  const showInfoModal = document.getElementById("showInfoModal");
  const showInfoFilm = document.getElementById("showInfoFilm");
  const showInfoDate = document.getElementById("showInfoDate");
  const showInfoTime = document.getElementById("showInfoTime");
  const showInfoSaal = document.getElementById("showInfoSaal");
  const showInfoRuntime = document.getElementById("showInfoRuntime");
  const showInfoPrice = document.getElementById("showInfoPrice");

  // ============================
  // STATE
  // ============================
  let movies = [];
  let shows = [];
  let halls = [];

  let currentMovie = null;     // Film Objekt
  let currentShow = null;      // Vorstellung Objekt
  let seatStatusList = [];     // Seats vom Backend
  let selectedSeats = [];      // { sitzId, bereich, reihe, platzNr, discount, priceCents }

  // Kalender State
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  // ============================
  // HELPERS
  // ============================

  function formatDuration(minutes) {
    if (minutes == null || minutes === "") return "-";

    // Debug helper: log raw value/type to console for troubleshooting
    try {
      console.debug("formatDuration input:", minutes, typeof minutes);
    } catch (e) {}

    // Handle ISO-8601 Duration strings from Java's Duration (e.g. "PT1H30M", "PT90M", "PT30S")
    if (typeof minutes === "string" && minutes.toUpperCase().startsWith("PT")) {
      const iso = minutes.toUpperCase();
      const hMatch = iso.match(/(\d+)H/);
      const mMatch = iso.match(/(\d+)M/);
      const sMatch = iso.match(/(\d+)S/);

      const hours = hMatch ? parseInt(hMatch[1], 10) : 0;
      const mins = mMatch ? parseInt(mMatch[1], 10) : 0;
      const secs = sMatch ? parseInt(sMatch[1], 10) : 0;

      const totalSeconds = hours * 3600 + mins * 60 + secs;
      if (totalSeconds === 0) return iso;

      // If duration is less than a minute, show seconds
      if (totalSeconds < 60) return `${totalSeconds}s`;

      // otherwise convert to rounded minutes for display
      const minutesValue = Math.round(totalSeconds / 60);
      if (minutesValue < 60) return `${minutesValue} min`;
      const h = Math.floor(minutesValue / 60);
      const rem = minutesValue % 60;
      return rem === 0 ? `${h}h` : `${h}h ${rem}min`;
    }

    // Handle objects like { seconds: 5400 } (Java Duration serialized)
    if (typeof minutes === "object") {
      const obj = minutes;
      if (obj == null) return "-";
      if (typeof obj.seconds === "number") {
        const totalSeconds = Math.round(obj.seconds);
        if (totalSeconds < 60) return `${totalSeconds}s`;
        return formatDuration(Math.round(totalSeconds / 60));
      }
      // try other common numeric fields
      if (typeof obj.totalSeconds === "number") {
        const totalSeconds = Math.round(obj.totalSeconds);
        if (totalSeconds < 60) return `${totalSeconds}s`;
        return formatDuration(Math.round(totalSeconds / 60));
      }
      return String(minutes);
    }

    // Numeric values: could be minutes or seconds. If value is large (>1000), assume seconds.
    const m = Number(minutes);
    if (isNaN(m) || m < 0) return String(minutes);
    const minutesValue = m > 1000 ? Math.round(m / 60) : m;
    if (minutesValue < 60) return `${minutesValue} min`;
    const h = Math.floor(minutesValue / 60);
    const rem = minutesValue % 60;
    return rem === 0 ? `${h}h` : `${h}h ${rem}min`;
  }

  function authHeaders() {
    const h = { "Content-Type": "application/json" };
    const token = localStorage.getItem("kino_token");
    if (token) h["Authorization"] = "Bearer " + token;
    return h;
  }

  async function apiGet(path) {
    const res = await fetch(API_BASE + path, { headers: authHeaders() });
    const text = await res.text().catch(() => "");
    if (!res.ok) throw new Error(`GET ${path} (${res.status}) ${text}`);
    return text ? JSON.parse(text) : null;
  }

  async function apiPost(path, body) {
    const res = await fetch(API_BASE + path, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    const text = await res.text().catch(() => "");
    if (!res.ok) throw new Error(`POST ${path} (${res.status}) ${text}`);
    return text ? JSON.parse(text) : null;
  }

  function formatEuroFromCents(cents) {
    const n = Number(cents || 0) / 100;
    return n.toFixed(2).replace(".", ",") + " €";
  }

  function splitZeit(iso) {
    if (!iso) return { datum: "", uhrzeit: "" };
    const cleaned = String(iso).replace(/([+-]\d{2}:\d{2}|Z)$/, "");
    if (!cleaned.includes("T")) return { datum: cleaned, uhrzeit: "" };
    const [d, t] = cleaned.split("T");
    return { datum: d, uhrzeit: (t || "").slice(0, 5) };
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

  function getShowSaalId(show) {
    return show?.saalId?.saalId ?? show?.saalId?.id ?? show?.saalId ?? null;
  }

  function hallNameById(id) {
    const h = halls.find(x => String(x?.saalId) === String(id));
    return h?.saalName ?? (id != null ? `Saal ${id}` : "-");
  }

  function calcSeatBasePriceCents(basisCents, bereich) {
    let price = Number(basisCents || 0);
    if ((bereich || "").toLowerCase().includes("loge")) {
      price = Math.round(price * 1.10);
    }
    return price;
  }

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem("kino_user") || "null");
    } catch {
      return null;
    }
  }

  function updateLoginButtons() {
    const user = getUser();
    const loggedIn = !!user?.id;
    if (loginBtnAss) loginBtnAss.style.display = loggedIn ? "inline-block" : "none";
    if (loginBtnNon) loginBtnNon.style.display = loggedIn ? "none" : "inline-block";
  }

  // ✅ NEU: Erwachsenen-Einzelpreis setzen (ohne Rabatt)
  // - ohne Sitz-Auswahl: Parkett/Basispreis
  // - mit Sitz-Auswahl: Preis passend zum Bereich des zuletzt ausgewählten Sitzes
  function updateErwachsenenPreis() {
    if (!preisErwachsene) return;

    const base = Number(currentMovie?.basispreis || 0);
    if (!currentMovie) {
      preisErwachsene.textContent = "0,00 €";
      return;
    }

    let bereich = "Parkett";
    if (selectedSeats.length) {
      bereich = selectedSeats[selectedSeats.length - 1].bereich || bereich;
    }

    const seatBase = calcSeatBasePriceCents(base, bereich);
    preisErwachsene.textContent = formatEuroFromCents(seatBase);
  }

  // ============================
  // UI VIEW TOGGLE
  // ============================
  function setView(mode) {
    if (!listenView || !kalenderView) return;
    if (mode === "list") {
      listenView.classList.remove("hidden");
      kalenderView.classList.add("hidden");
      btnViewList?.classList.add("active-view");
      btnViewCalendar?.classList.remove("active-view");
    } else {
      listenView.classList.add("hidden");
      kalenderView.classList.remove("hidden");
      btnViewList?.classList.remove("active-view");
      btnViewCalendar?.classList.add("active-view");
    }
  }

  btnViewList?.addEventListener("click", () => setView("list"));
  btnViewCalendar?.addEventListener("click", () => setView("calendar"));

  // ============================
  // RENDER: FILMLISTE LINKS
  // ============================
  function renderMovieList() {
    if (!filmListeEl) return;
    filmListeEl.innerHTML = "";

    if (!movies.length) {
      const li = document.createElement("li");
      li.textContent = "Keine Filme vorhanden.";
      filmListeEl.appendChild(li);
      return;
    }

    movies.forEach((m) => {
      const li = document.createElement("li");
      li.textContent = m.filmname ?? `Film ${m.id}`;
      li.dataset.movieId = String(m.id);

      li.addEventListener("click", () => {
        currentMovie = m;
        currentShow = null;
        selectedSeats = [];
        seatStatusList = [];

        renderMovieDetails();
        renderShowList();
        renderCalendar();
        resetBookingUI();

        // ✅ Preis aktualisieren wenn Film gewechselt
        updateErwachsenenPreis();
      });

      filmListeEl.appendChild(li);
    });
  }

  // ============================
  // RENDER: FILM DETAILS RECHTS
  // ============================
  function renderMovieDetails() {
    if (!currentMovie) {
      inhaltTitel.textContent = "Bitte einen Film auswählen";
      detailsWrapper?.classList.add("hidden");
      updateErwachsenenPreis();
      return;
    }

    inhaltTitel.textContent = currentMovie.filmname ?? "Film";
    detailsWrapper?.classList.remove("hidden");

    infoFsk.textContent = currentMovie.fsk ?? "-";
    infoFormat.textContent = currentMovie.darstellungstyp ?? currentMovie.format ?? "-";
    infoKategorie.textContent = currentMovie.kategorie ?? "-";
    infoLaufzeit.textContent = (currentMovie?.filmdauer != null) ? formatDuration(currentMovie.filmdauer) : "-";
    infoPreis.textContent = formatEuroFromCents(currentMovie.basispreis ?? 0);
    inhaltText.textContent = currentMovie.beschreibung ?? "";

    // ✅ Preis aktualisieren
    updateErwachsenenPreis();
  }

  // ============================
  // RENDER: VORSTELLUNGEN LISTE
  // ============================
  function renderShowList() {
    if (!vorstellungenTbody) return;
    vorstellungenTbody.innerHTML = "";

    if (!currentMovie) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="3">Bitte Film auswählen.</td>`;
      vorstellungenTbody.appendChild(tr);
      return;
    }

    const filtered = shows
      .filter(s => String(getShowFilmId(s)) === String(currentMovie.id))
      .sort((a, b) => String(getShowDatumISO(a)).localeCompare(String(getShowDatumISO(b))));

    if (!filtered.length) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="3">Keine Vorstellungen vorhanden.</td>`;
      vorstellungenTbody.appendChild(tr);
      return;
    }

    filtered.forEach((show) => {
      const sid = getShowId(show);
      const saalId = getShowSaalId(show);
      const { datum, uhrzeit } = splitZeit(getShowDatumISO(show));

      const tr = document.createElement("tr");
      tr.style.cursor = "pointer";

      tr.innerHTML = `
        <td>${datum || "-"}</td>
        <td>${uhrzeit || "-"}</td>
        <td>${hallNameById(saalId)}</td>
      `;

      tr.addEventListener("click", () => {
        currentShow = show;
        selectedSeats = [];
        seatStatusList = [];
        renderSelectedShowInfo();

        // ✅ wenn Show gewählt: Erwachsene wieder "Parkett" anzeigen, da noch kein Sitz gewählt
        updateErwachsenenPreis();

        // optional modal info:
        showInfoFilm && (showInfoFilm.textContent = currentMovie?.filmname || "-");
        showInfoDate && (showInfoDate.textContent = datum || "-");
        showInfoTime && (showInfoTime.textContent = uhrzeit || "-");
        showInfoSaal && (showInfoSaal.textContent = hallNameById(saalId));
        showInfoRuntime && (showInfoRuntime.textContent = (currentMovie?.filmdauer != null) ? formatDuration(currentMovie?.filmdauer) : "-");
        showInfoPrice && (showInfoPrice.textContent = formatEuroFromCents(currentMovie?.basispreis || 0));
      });

      vorstellungenTbody.appendChild(tr);
    });
  }

  function renderSelectedShowInfo() {
    if (!buchungVorstellungInfo) return;
    if (!currentShow) {
      buchungVorstellungInfo.textContent = "Ausgewählte Vorstellung: keine";
      return;
    }
    const saalId = getShowSaalId(currentShow);
    const { datum, uhrzeit } = splitZeit(getShowDatumISO(currentShow));
    buchungVorstellungInfo.textContent =
      `Ausgewählte Vorstellung: ${datum || "-"} ${uhrzeit || ""} • ${hallNameById(saalId)}`;
  }

  // ============================
  // RENDER: KALENDER
  // ============================
  function getMonatsName(m) {
    const arr = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
    return arr[m] || "";
  }

  function renderCalendar() {
    if (!kalenderBody || !kalMonatLabel) return;

    kalenderBody.innerHTML = "";
    kalMonatLabel.textContent = `${getMonatsName(currentMonth)} ${currentYear}`;

    if (!currentMovie) return;

    const filtered = shows.filter(s => String(getShowFilmId(s)) === String(currentMovie.id));

    const map = {};
    filtered.forEach((show) => {
      const { datum, uhrzeit } = splitZeit(getShowDatumISO(show));
      if (!datum) return;
      if (!map[datum]) map[datum] = [];
      map[datum].push({ show, uhrzeit });
    });

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startWochentag = (firstDay.getDay() + 6) % 7;
    const tageImMonat = lastDay.getDate();

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
            const ev = document.createElement("span");
            ev.classList.add("kal-event");
            ev.textContent = `${uhrzeit || "--:--"} • ${hallNameById(getShowSaalId(show))}`;
            ev.style.cursor = "pointer";
            ev.addEventListener("click", () => {
              currentShow = show;
              selectedSeats = [];
              seatStatusList = [];
              renderSelectedShowInfo();
              resetBookingTable();

              // ✅ Erwachsene Preis zurück auf Parkett (weil keine Seats gewählt)
              updateErwachsenenPreis();
            });
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

  // ============================
  // BOOKING FLOW
  // ============================
  function resetBookingTable() {
    selectedSeats = [];
    seatStatusList = [];
    if (ticketsTbody) ticketsTbody.innerHTML = "";
    if (ausgewaehlteSitzeEl) ausgewaehlteSitzeEl.textContent = "keine";
    if (summeAnzeige) summeAnzeige.textContent = "0,00 €";
    if (sitzContainer) sitzContainer.innerHTML = "";

    // ✅ Erwachsene Preis (Parkett) setzen
    updateErwachsenenPreis();
  }

  function resetBookingUI() {
    buchenBox?.classList.add("hidden");
    inhaltBox?.classList.remove("hidden");
    resetBookingTable();
    renderSelectedShowInfo();
  }

  buchenBtn?.addEventListener("click", async () => {
    const user = getUser();
    if (!user?.id) {
      alert("Bitte zuerst einloggen, um zu buchen.");
      window.location.href = "login.html";
      return;
    }

    if (!currentMovie) return alert("Bitte zuerst einen Film auswählen.");
    if (!currentShow) return alert("Bitte zuerst eine Vorstellung auswählen (Datum/Uhrzeit/Saal).");

    // UI switch
    inhaltBox?.classList.add("hidden");
    buchenBox?.classList.remove("hidden");

    renderSelectedShowInfo();
    resetBookingTable();

    try {
      await loadSeatPlan();
      // ✅ Nach Laden: Erwachsene Preis nochmal setzen (Parkett default)
      updateErwachsenenPreis();
    } catch (e) {
      console.error(e);
      alert("Sitzplan konnte nicht geladen werden.\n\n" + e.message);
      resetBookingUI();
    }
  });

  zurueckBtn?.addEventListener("click", () => {
    resetBookingUI();
  });

  async function loadSeatPlan() {
    const sid = getShowId(currentShow);
    const saalId = getShowSaalId(currentShow);

    if (sid == null || saalId == null) {
      throw new Error("VorstellungId oder SaalId fehlt in den Daten.");
    }

    seatStatusList = await apiGet(API.seatStatus(sid, saalId));
    renderSeatGrid(seatStatusList);
  }

  function renderSeatGrid(list) {
    if (!sitzContainer) return;
    sitzContainer.innerHTML = "";

    if (!Array.isArray(list) || !list.length) {
      sitzContainer.textContent = "Keine Sitzdaten vorhanden.";
      return;
    }

    // gruppiere nach Reihe
    const rows = new Map();
    list.forEach(s => {
      const r = Number(s.reihe || 0);
      if (!rows.has(r)) rows.set(r, []);
      rows.get(r).push(s);
    });

    const sortedRowNumbers = Array.from(rows.keys()).sort((a, b) => a - b);

    sortedRowNumbers.forEach((r) => {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("sitzreihe");

      const seats = rows.get(r).sort((a, b) => Number(a.platzNr) - Number(b.platzNr));

      seats.forEach((seat) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.classList.add("sitz");

        const isLoge = (seat.bereich || "").toLowerCase().includes("loge");
        if (seat.belegt) btn.classList.add("belegt");
        else btn.classList.add(isLoge ? "premium" : "standard");

        btn.textContent = String(seat.platzNr ?? "");
        btn.title = `Reihe ${seat.reihe} Platz ${seat.platzNr} (${seat.bereich})`;

        if (seat.belegt) {
          btn.disabled = true;
        } else {
          btn.addEventListener("click", () => {
            toggleSeat(seat);
          });
        }

        rowDiv.appendChild(btn);
      });

      sitzContainer.appendChild(rowDiv);
    });
  }

  function toggleSeat(seat) {
    const id = seat.sitzId ?? seat.id;
    if (id == null) return;

    const idx = selectedSeats.findIndex(s => String(s.sitzId) === String(id));
    if (idx >= 0) {
      selectedSeats.splice(idx, 1);
    } else {
      selectedSeats.push({
        sitzId: id,
        reihe: seat.reihe,
        platzNr: seat.platzNr,
        bereich: seat.bereich,
        discount: "NONE",
        priceCents: 0,
      });
    }

    // ✅ Erwachsene Preis aktualisieren (je nach letztem Bereich)
    updateErwachsenenPreis();

    renderTicketsTable();
  }

  function renderTicketsTable() {
    if (!ticketsTbody) return;
    ticketsTbody.innerHTML = "";

    if (!selectedSeats.length) {
      if (ausgewaehlteSitzeEl) ausgewaehlteSitzeEl.textContent = "keine";
      if (summeAnzeige) summeAnzeige.textContent = "0,00 €";

      // ✅ Wenn keine Seats: Parkett/Einzelpreis anzeigen
      updateErwachsenenPreis();
      return;
    }

    // Anzeige: ausgewählte Plätze
    if (ausgewaehlteSitzeEl) {
      const txt = selectedSeats
        .map(s => `R${s.reihe}-P${s.platzNr}`)
        .join(", ");
      ausgewaehlteSitzeEl.textContent = txt || "keine";
    }

    const base = Number(currentMovie?.basispreis || 0);

    selectedSeats.forEach((s) => {
      const tr = document.createElement("tr");

      const tdPlatz = document.createElement("td");
      tdPlatz.textContent = String(s.sitzId);

      const tdBereich = document.createElement("td");
      tdBereich.textContent = s.bereich || "-";

      const tdDiscount = document.createElement("td");
      const sel = document.createElement("select");
      sel.innerHTML = `
        <option value="NONE">-</option>
        <option value="STUDENT">Student (-20%)</option>
        <option value="SENIOR">Senior (-15%)</option>
        <option value="CHILD">Kind (-30%)</option>
      `;
      sel.value = s.discount || "NONE";
      tdDiscount.appendChild(sel);

      const tdPreis = document.createElement("td");

      function updatePrice() {
        const key = sel.value || "NONE";
        s.discount = key;

        const seatBase = calcSeatBasePriceCents(base, s.bereich);
        const factor = DISCOUNTS[key] ?? 1.0;
        s.priceCents = Math.round(seatBase * factor);

        tdPreis.textContent = formatEuroFromCents(s.priceCents);
        renderSum();

        // ✅ optional: Erwachsene Preis aktuell halten
        updateErwachsenenPreis();
      }

      sel.addEventListener("change", updatePrice);

      // initial
      updatePrice();

      tr.appendChild(tdPlatz);
      tr.appendChild(tdBereich);
      tr.appendChild(tdDiscount);
      tr.appendChild(tdPreis);

      ticketsTbody.appendChild(tr);
    });

    renderSum();
    updateErwachsenenPreis();
  }

  function renderSum() {
    const total = selectedSeats.reduce((acc, s) => acc + Number(s.priceCents || 0), 0);
    if (summeAnzeige) summeAnzeige.textContent = formatEuroFromCents(total);
  }

  // ============================
  // CHECKOUT
  // ============================
  bezahlenBtn?.addEventListener("click", async () => {
    const user = getUser();
    if (!user?.id) return alert("Bitte einloggen.");

    const sid = getShowId(currentShow);
    const seatIds = selectedSeats.map(s => s.sitzId).filter(Boolean);

    if (!sid) return alert("Vorstellung fehlt.");
    if (!seatIds.length) return alert("Bitte mindestens einen Sitz auswählen.");

    const body = {
      benutzerId: user.id,
      vorstellungId: sid,
      sitzplatzIds: seatIds,
    };

    try {
      const resp = await apiPost(API.checkout, body);
      if (!resp?.ok) {
        alert("Checkout fehlgeschlagen: " + (resp?.message || "Unbekannter Fehler"));
        return;
      }

      alert(
        `Buchung gespeichert!\n\nBuchungs-ID: ${resp.buchungId}\nSumme: ${formatEuroFromCents(resp.totalCents)}`
      );

      // danach Sitzplan neu laden (damit belegt aktualisiert)
      await loadSeatPlan();
      resetBookingTable();
      renderSelectedShowInfo();
      resetBookingUI();
    } catch (e) {
      console.error(e);
      alert("Checkout fehlgeschlagen.\n\n" + e.message);
    }
  });

  // ============================
  // INIT LOAD
  // ============================
  async function reloadAll() {
    updateLoginButtons();

    movies = await apiGet(API.filmeList);
    shows = await apiGet(API.showsList);
    halls = await apiGet(API.hallsList);

    renderMovieList();
    renderMovieDetails();
    renderShowList();
    renderCalendar();
    renderSelectedShowInfo();

    setView("list");

    // ✅ initial setzen
    updateErwachsenenPreis();
  }

  // Start
  (async () => {
    try {
      await reloadAll();
    } catch (e) {
      console.error(e);
      alert("Konnte Daten nicht laden.\n\nBackend erreichbar? " + API_BASE + "\n\n" + e.message);
    }
  })();
});