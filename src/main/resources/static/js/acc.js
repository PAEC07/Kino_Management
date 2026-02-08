document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:8080";

  // --------------------------
  // API ENDPOINTS (ANPASSEN!)
  // --------------------------
  const API_ENDPOINTS = {
    // User laden (eigene Daten)
    me: "/api/users/me",                 // GET
    updateMe: "/api/users/me",           // PUT/PATCH

    // Tickets des eingeloggten Users
    myTickets: "/api/tickets/me",        // GET  -> Liste
    cancelTicket: (ticketId) => `/api/tickets/${ticketId}/cancel`, // POST oder DELETE
    // Alternative, falls ihr DELETE nutzt:
    // cancelTicket: (ticketId) => `/api/tickets/${ticketId}`,
  };

  // --------------------------
  // Auth / Storage
  // --------------------------
  const user = safeJsonParse(localStorage.getItem("kino_user"));
  const token = localStorage.getItem("kino_token"); // optional

  // Wenn nicht eingeloggt -> login
  if (!user && !token) {
    window.location.href = "login.html";
    return;
  }

  function authHeaders() {
    const h = { "Content-Type": "application/json" };
    if (token) h["Authorization"] = "Bearer " + token;
    return h;
  }

  async function apiGet(path) {
    const res = await fetch(API_BASE + path, { headers: authHeaders() });
    if (!res.ok) throw new Error(await safeError(res));
    return res.json();
  }

  async function apiSend(method, path, body) {
    const res = await fetch(API_BASE + path, {
      method,
      headers: authHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(await safeError(res));
    // kann JSON oder leer sein:
    const txt = await res.text();
    try { return JSON.parse(txt); } catch { return { ok: true }; }
  }

  async function safeError(res) {
    const t = await res.text();
    return t || `HTTP ${res.status}`;
  }

  function safeJsonParse(s) {
    try { return JSON.parse(s); } catch { return null; }
  }

  // --------------------------
  // DOM
  // --------------------------
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

  // Ticketliste
  const ticketList = document.getElementById("ticketList"); // muss in HTML existieren!
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

  // --------------------------
  // Render Tickets
  // Erwartetes Ticket-Objekt (Beispiel):
  // {
  //   id: 123,
  //   filmTitel: "...",
  //   beschreibung: "...",
  //   fsk: 12,
  //   format: "2D/3D",
  //   kategorie: "...",
  //   laufzeit: 120,
  //   preis: 12.99,
  //   datum: "2026-02-09",
  //   uhrzeit: "20:00",
  //   status: "ACTIVE" / "CANCELED"
  // }
  // --------------------------
  function renderTickets(tickets) {
    if (!ticketList) return;
    ticketList.innerHTML = "";

    if (!tickets || tickets.length === 0) {
      setNoTickets(true);
      return;
    }
    setNoTickets(false);

    tickets.forEach(t => {
      const li = document.createElement("li");
      li.dataset.ticket = JSON.stringify(t);

      const dateText = t.datum || "";
      const timeText = t.uhrzeit ? (t.uhrzeit + " Uhr") : "";

      li.innerHTML = `
        <div class="ticket-row">
          <div class="ticket-info">
            <div class="ticket-title"></div>
            <div class="ticket-meta">
              <span>Datum: <span class="ticket-date"></span></span>
              <span>Vorstellung: <span class="ticket-time"></span></span>
            </div>
          </div>
          <div>
            <button class="ticket-info-btn" type="button">Information</button>
            <button class="ticket-cancel-btn" type="button">Stornieren</button>
          </div>
        </div>
      `;

      li.querySelector(".ticket-title").textContent = t.filmTitel || "Unbekannter Film";
      li.querySelector(".ticket-date").textContent = dateText;
      li.querySelector(".ticket-time").textContent = timeText;

      // optional: Cancel-Button deaktivieren, wenn schon storniert
      if ((t.status || "").toUpperCase() === "CANCELED") {
        const cancelBtn = li.querySelector(".ticket-cancel-btn");
        cancelBtn.disabled = true;
        cancelBtn.textContent = "Storniert";
      }

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
    if (infoLaufzeit) infoLaufzeit.textContent = ticket.laufzeit ? (ticket.laufzeit + " min") : "";

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
      const me = await apiGet(API_ENDPOINTS.me);

      // Speichern (damit navbar etc. aktuell bleibt)
      localStorage.setItem("kino_user", JSON.stringify(me));

      if (spanName) spanName.textContent = me.username ?? "";
      if (spanEmail) spanEmail.textContent = me.email ?? "";
      if (spanReg) spanReg.textContent = formatDateDE(me.createdAt);
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
      const tickets = await apiGet(API_ENDPOINTS.myTickets);
      renderTickets(tickets);
    } catch (e) {
      console.error("Tickets laden fehlgeschlagen:", e.message);
      renderTickets([]);
    }
  }

  // --------------------------
  // Profil bearbeiten
  // --------------------------
  function openProfileModal() {
    if (spanName && inputName) inputName.value = spanName.textContent.trim();
    if (spanEmail && inputEmail) inputEmail.value = spanEmail.textContent.trim();
    if (inputPass) inputPass.value = "";
    showOverlay("profile");
  }

  async function saveProfile() {
    const newUsername = inputName?.value?.trim();
    const newEmail = inputEmail?.value?.trim();
    const newPassword = inputPass?.value || "";

    const body = {
      username: newUsername,
      email: newEmail,
      password: newPassword && newPassword.trim() !== "" ? newPassword : null
    };

    // Je nach Backend wollt ihr PATCH statt PUT:
    // const updated = await apiSend("PATCH", API_ENDPOINTS.updateMe, body);
    const updated = await apiSend("PUT", API_ENDPOINTS.updateMe, body);

    // Anzeige aktualisieren (je nach Antwortformat)
    const newUser = updated.username ? updated : (updated.user || body);

    if (spanName) spanName.textContent = newUser.username ?? (newUsername ?? "");
    if (spanEmail) spanEmail.textContent = newUser.email ?? (newEmail ?? "");
    if (spanPass) spanPass.textContent = "••••••••";

    // localStorage aktualisieren
    const old = safeJsonParse(localStorage.getItem("kino_user")) || {};
    localStorage.setItem("kino_user", JSON.stringify({ ...old, ...newUser }));

    hideOverlay();
    alert("Account-Daten gespeichert.");
  }

  // --------------------------
  // Ticket stornieren
  // --------------------------
  async function cancelTicket(ticket) {
    const ok = confirm("Ticket wirklich stornieren?");
    if (!ok) return;

    try {
      // Wenn ihr DELETE nutzt:
      // await apiSend("DELETE", API_ENDPOINTS.cancelTicket(ticket.id));
      // Wenn ihr POST /cancel nutzt:
      await apiSend("POST", API_ENDPOINTS.cancelTicket(ticket.id));

      // neu laden
      await loadTickets();
      alert("Ticket wurde storniert.");
    } catch (e) {
      alert("Stornieren fehlgeschlagen: " + e.message);
    }
  }

  // --------------------------
  // Events
  // --------------------------
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

  // --------------------------
  // Initial load
  // --------------------------
  loadAccount();
  loadTickets();
});
