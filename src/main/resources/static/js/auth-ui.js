/**
 * AUTHENTIFIZIERUNGS-UI MODULE
 * ====================================
 * Verwaltet die Sichtbarkeit von Login/Logout Buttons
 * basierend auf Authentifizierungs-Status
 * 
 * Wenn Benutzer angemeldet ist:
 * - Login-Button verborgen
 * - Konto/Logout-Button sichtbar
 * 
 * Diese Datei wird auf allen Seiten aufgerufen um die Navigation zu aktualisieren
 */

(function () {
  const loginBtn = document.getElementById("Login-btn-non-autenthicated");
  const kontoBtn = document.getElementById("Login-btn-autenthicated");

  // Prüfe ob Token im localStorage existiert = Benutzer ist eingeloggt
  const token = localStorage.getItem("kino_token");
  const isLoggedIn = !!token;

  // Zeige/verstecke Buttons basierend auf Login-Status
  if (loginBtn) loginBtn.style.display = isLoggedIn ? "none" : "inline-block";
  if (kontoBtn) kontoBtn.style.display = isLoggedIn ? "inline-block" : "none";
})();