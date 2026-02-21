document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:8080";




  // --------------------------
  // Storage / Auth
  // --------------------------
  const user = safeJsonParse(localStorage.getItem("kino_user"));
  const token = localStorage.getItem("kino_token"); // optional

  if (!user?.id && !token) {
    window.location.href = "login.html";
    return;
  }

  function authHeaders() {
    const h = { "Content-Type": "application/json" };
    if (token) h["Authorization"] = "Bearer " + token;
    return h;
  }

  // --------------------------
  // API ENDPOINTS
  // --------------------------
  const API = {
    me: `/api/benutzer/${user?.id}/get`,
    updateMe: `/api/benutzer/${user?.id}/change`,

    // ✅ Tickets für Account-Seite
    myTickets: `/api/tickets/user/${user?.id}`,

    // ✅ Storno: Buchung löschen
    cancelBooking: (buchungId) => `/api/buchungen/${buchungId}/delete`,
  };

  async function apiGet(path) {
    const res = await fetch(API_BASE + path, { headers: authHeaders() });
    const txt = await res.text().catch(() => "");
    if (!res.ok) throw new Error(txt || `HTTP ${res.status}`);
    return txt ? JSON.parse(txt) : null;
  }

  async function apiSend(method, path, body) {
    const res = await fetch(API_BASE + path, {
      method,
      headers: authHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    const txt = await res.text().catch(() => "");
    if (!res.ok) throw new Error(txt || `HTTP ${res.status}`);
    return txt ? safeJsonParse(txt) : { ok: true };
  }

  function safeJsonParse(s) {
    try { return JSON.parse(s); } catch { return null; }
  }

  function formatEuroFromCents(cents) {
    const n = Number(cents || 0) / 100;
    return n.toFixed(2).replace(".", ",") + " €";
  }

  function formatDateDE(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return String(iso);
    return d.toLocaleDateString("de-DE");
  }

  function formatTimeDE(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  }


  const overlay = document.getElementById("modalOverlay");
  const modalProfile = document.getElementById("modalProfile");
  const modalFilmInfo = document.getElementById("modalFilmInfo");

  const closeProfileBtn = document.getElementById("modalCloseProfile");
  const closeInfoBtn = document.getElementById("modalCloseInfo");
  const backInfoBtn = document.getElementById("FilmInfoBack");

  const saveBtn = document.getElementById("Save");
  const openProfileBtn = document.getElementById("btnändern");

  // Anzeige Account
  const spanName = document.getElementById("inhaltBenutzername");
  const spanEmail = document.getElementById("inhaltEmail");
  const spanReg = document.getElementById("inhaltRegistrierungsdatum");
  const spanPass = document.getElementById("inhaltPasswort");

  // Eingaben Modal
  const inputName = document.getElementById("ModelinhaltBenutzername");
  const inputEmail = document.getElementById("ModelinhaltEmail");
  const inputPass = document.getElementById("ModelinhaltPasswort");

  // Film-/Ticket-Info Modal
  const infoTitel = document.getElementById("Titel");
  const infoText = document.getElementById("Beschreibung");
  const infoKategorie = document.getElementById("Kategorie");
  const infoFsk = document.getElementById("FSK");
  const infoFormat = document.getElementById("Format");
  const infoPreis = document.getElementById("Preis");
  const infoDate = document.getElementById("Date");
  const infoTime = document.getElementById("Time");
  const infoLaufzeit = document.getElementById("Laufzeit");

  const infoSaal = document.getElementById("Saal");
  const infoSitz = document.getElementById("Sitz");

  const ticketList = document.getElementById("ticketList");
  const noTicketsHint = document.getElementById("noTicketsHint");

  // --------------------------
  // UI helper
  // --------------------------
  function formatEuro(val) {
    const num = isNaN(val) ? 0 : Number(val);
    return num.toFixed(2).replace(".", ",") + " €";
  }

  function showOverlay(which) {
    overlay?.classList.add("active");
    overlay?.classList.remove("hidden");

    modalProfile?.classList.add("hidden");
    modalFilmInfo?.classList.add("hidden");

    if (which === "profile") modalProfile?.classList.remove("hidden");
    if (which === "info") modalFilmInfo?.classList.remove("hidden");
  }

  function hideOverlay() {
    overlay?.classList.remove("active");
    modalProfile?.classList.add("hidden");
    modalFilmInfo?.classList.add("hidden");
  }

  function setNoTickets(visible) {
    if (!noTicketsHint) return;
    noTicketsHint.classList.toggle("hidden", !visible);
  }

  async function loadAccount() {
    try {
      const me = await apiGet(API.me);
      localStorage.setItem("kino_user", JSON.stringify(me));

      if (spanName) spanName.textContent = me.username ?? "-";
      if (spanEmail) spanEmail.textContent = me.email ?? "-";
      if (spanReg) spanReg.textContent = formatDateDE(me.createdAt);
      if (spanPass) spanPass.textContent = "••••••••";
    } catch (e) {
      console.warn("Account konnte nicht geladen werden:", e.message);
      if (spanName) spanName.textContent = user?.username ?? "-";
      if (spanEmail) spanEmail.textContent = user?.email ?? "-";
      if (spanReg) spanReg.textContent = formatDateDE(user.createdAt);
      if (spanPass) spanPass.textContent = "••••••••";
    }
  }


  function renderTickets(tickets) {
    if (!ticketList) return;
    ticketList.innerHTML = "";

    if (!Array.isArray(tickets) || tickets.length === 0) {
      setNoTickets(true);
      return;
    }
    setNoTickets(false);

    tickets.sort((a, b) => String(a.datum || "").localeCompare(String(b.datum || "")));

    tickets.forEach(t => {
      const li = document.createElement("li");
      li.dataset.ticket = JSON.stringify(t);

      const dateText = formatDateDE(t.datum);
      const timeText = formatTimeDE(t.datum);

      li.innerHTML = `
        <div class="ticket-row">
          <div class="ticket-info">
            <div class="ticket-title"></div>
            <div class="ticket-meta">
              <span>Datum: <span class="ticket-date"></span></span>
              <span>Vorstellung: <span class="ticket-time"></span></span>
            </div>
            <div class="ticket-meta">
              <span>Saal: <span class="ticket-saal"></span></span>
              <span>Sitz: <span class="ticket-seat"></span></span>
            </div>
          </div>
          <div>
            <button class="ticket-info-btn" type="button">Information</button>
            <button class="ticket-cancel-btn" type="button">Stornieren</button>
          </div>
        </div>
      `;

      li.querySelector(".ticket-title").textContent = t.filmTitel || "Unbekannter Film";
      li.querySelector(".ticket-date").textContent = dateText || "-";
      li.querySelector(".ticket-time").textContent = (timeText ? timeText + " Uhr" : "-");
      li.querySelector(".ticket-saal").textContent = t.saalName || "-";

      const seatTxt = (t.reihe != null && t.platzNr != null)
        ? `R${t.reihe} P${t.platzNr} (${t.bereich || "-"})`
        : "-";
      li.querySelector(".ticket-seat").textContent = seatTxt;

      ticketList.appendChild(li);
    });
  }

  // --------------------------
  // Ticket Info Modal füllen
  // --------------------------
  function openTicketInfoModal(ticket) {
    if (!ticket) return;

    if (infoTitel) infoTitel.textContent = ticket.filmTitel || "";
    if (infoText) infoText.textContent = ticket.beschreibung || "";
    if (infoFsk) infoFsk.textContent = ticket.fsk ?? "";
    if (infoFormat) infoFormat.textContent = ticket.format || "";
    if (infoKategorie) infoKategorie.textContent = ticket.kategorie || "";
    if (infoLaufzeit) infoLaufzeit.textContent = ticket.laufzeit ? (ticket.laufzeit) : "";

    if (infoPreis) infoPreis.textContent = formatEuro(ticket.preis || 0);
    if (infoDate) infoDate.textContent = ticket.datum || "";
    if (infoTime) infoTime.textContent = ticket.uhrzeit ? (ticket.uhrzeit + " Uhr") : "";

    showOverlay("info");
  }

  // --------------------------
  // Account laden & anzeigen
  // Erwartetes User-Objekt:
  // { username, email, createdAt }
  // --------------------------
  async function loadAccount() {
    // Versuch 1: /me
    try {
      const me = await apiGet(API.me);

      // Speichern (damit navbar etc. aktuell bleibt)
      localStorage.setItem("kino_user", JSON.stringify(me));

      if (spanName) spanName.textContent = me.username ?? "USERNAME N/A";
      if (spanEmail) spanEmail.textContent = me.email ?? "MAIL N/A";
      if (spanReg) spanReg.textContent = formatDateDE(me.createdAt) ?? "N/A";
      if (spanPass) spanPass.textContent = "••••••••";
      return;
    } catch (e) {
      // Fallback: wenn backend /me nicht hat, nutzt localStorage
      if (user) {
        if (spanName) spanName.textContent = user.username ?? "";
        if (spanEmail) spanEmail.textContent = user.email ?? "";
        if (spanReg) spanReg.textContent = formatDateDE(user.createdAt);
        if (spanPass) spanPass.textContent = "••••••••";
      }
      console.warn("Konnte /me nicht laden:", e.message);
    }
  }

  function formatDuration(minutes) {
      if (minutes == null || minutes === "") return "-";
      const m = Number(minutes);
      if (isNaN(m) || m < 0) return String(minutes);
      if (m < 60) return `${m} min`;
      const h = Math.floor(m / 60);
      const rem = m % 60;
      return rem === 0 ? `${h}h` : `${h}h ${rem}min`;
    }

  function formatDateDE(iso) {
    if (!iso) return "";
    // iso kann "2025-01-01" oder "2025-01-01T..." sein
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("de-DE");
  }

  // --------------------------
  // Tickets laden
  // --------------------------
  async function loadTickets() {
    try {
      const tickets = await apiGet(API.myTickets);
      renderTickets(tickets);
    } catch (e) {
      console.error("Tickets laden fehlgeschlagen:", e.message);
      renderTickets([]);
    }
  }


  function openTicketInfoModal(ticket) {
    if (!ticket) return;

    if (infoTitel) infoTitel.textContent = ticket.filmTitel || "-";
    if (infoText) infoText.textContent = ticket.beschreibung || "";
    if (infoFsk) infoFsk.textContent = ticket.fsk ?? "-";
    if (infoFormat) infoFormat.textContent = ticket.format || "-";
    if (infoKategorie) infoKategorie.textContent = ticket.kategorie || "-";

    if (infoSaal) infoSaal.textContent = ticket.saalName || "-";
    const seatTxt = (ticket.reihe != null && ticket.platzNr != null)
      ? `R${ticket.reihe} P${ticket.platzNr} (${ticket.bereich || "-"})`
      : "-";
    if (infoSitz) infoSitz.textContent = seatTxt;

    if (infoPreis) infoPreis.textContent = formatEuroFromCents(ticket.preisCents);
    if (infoDate) infoDate.textContent = formatDateDE(ticket.datum);
    if (infoTime) infoTime.textContent = formatTimeDE(ticket.datum) ? (formatTimeDE(ticket.datum) + " Uhr") : "-";

    showOverlay("info");
  }

  function openProfileModal() {
    if (spanName && inputName) inputName.value = spanName.textContent.trim();
    if (spanEmail && inputEmail) inputEmail.value = spanEmail.textContent.trim();
    if (inputPass) inputPass.value = "";
    showOverlay("profile");
  }

  async function saveProfile() {
    const newUsername = inputName?.value?.trim();
    const newEmail = inputEmail?.value?.trim();
    const newPassword = inputPass?.value?.trim();

    const body = {
      username: newUsername,
      email: newEmail,
      password: newPassword && newPassword.length > 0 ? newPassword : null
    };

    const updated = await apiSend("PUT", API.updateMe, body);

    if (spanName) spanName.textContent = updated.username ?? newUsername ?? "-";
    if (spanEmail) spanEmail.textContent = updated.email ?? newEmail ?? "-";
    if (spanPass) spanPass.textContent = "••••••••";

    // localStorage aktualisieren
    const old = safeJsonParse(localStorage.getItem("kino_user")) || {};
    localStorage.setItem("kino_user", JSON.stringify({ ...old, ...updated }));

    hideOverlay();
    alert("Account-Daten gespeichert.");
  }


  async function cancelTicket(ticket) {
    const ok = confirm("Diese Buchung wirklich stornieren? (Alle Tickets der Buchung werden gelöscht)");
    if (!ok) return;

    if (!ticket?.buchungId) {
      alert("Keine BuchungsId vorhanden – kann nicht stornieren.");
      return;
    }

    try {
      await apiSend("DELETE", API.cancelBooking(ticket.buchungId));
      await loadTickets();
      alert("Buchung storniert.");
    } catch (e) {
      alert("Stornieren fehlgeschlagen: " + e.message);
    }
  }


  openProfileBtn?.addEventListener("click", openProfileModal);
  saveBtn?.addEventListener("click", () => saveProfile().catch(err => alert(err.message)));

  closeProfileBtn?.addEventListener("click", hideOverlay);
  closeInfoBtn?.addEventListener("click", hideOverlay);
  backInfoBtn?.addEventListener("click", hideOverlay);

  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) hideOverlay();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideOverlay();
  });

  // Ticket Buttons (delegation)
  document.addEventListener("click", (e) => {
    const infoBtn = e.target.closest(".ticket-info-btn");
    const cancelBtn = e.target.closest(".ticket-cancel-btn");

    if (!infoBtn && !cancelBtn) return;

    const li = e.target.closest("li");
    if (!li) return;

    const ticket = safeJsonParse(li.dataset.ticket);
    if (!ticket) return;

    if (infoBtn) openTicketInfoModal(ticket);
    if (cancelBtn) cancelTicket(ticket);
  });


  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("kino_token");
    localStorage.removeItem("kino_user");
    window.location.href = "login.html";
  });

  // optional: alles weg
  // localStorage.clear();

  loadAccount();
  loadTickets();
});
