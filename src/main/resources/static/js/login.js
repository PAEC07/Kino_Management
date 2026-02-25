document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:8080";

  const form = document.getElementById("loginForm");
  const err = document.getElementById("loginError");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (err) err.textContent = "";

    const username = document.getElementById("loginUsername")?.value.trim();
    const password = document.getElementById("loginPassword")?.value;

    if (!username || !password) {
      if (err) err.textContent = "Bitte Benutzername und Passwort eingeben.";
      return;
    }

    try {
      const res = await fetch(API_BASE + "/api/benutzer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        if (err) err.textContent = data?.message || "Login fehlgeschlagen.";
        return;
      }

      // ✅ Token speichern
      localStorage.setItem("kino_token", data.token || "");

      // ✅ User speichern (inkl. role)
      const user = {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role // "ADMIN" oder "USER"
      };
      localStorage.setItem("kino_user", JSON.stringify(user));

      // ✅ Redirect abhängig von role
      const role = (data.role || "").toUpperCase();
      if (role === "ADMIN") {
        window.location.href = "Admin.html";
      } else {
        window.location.href = "index.html";
      }
    } catch (e2) {
      console.error(e2);
      if (err) err.textContent = "Server nicht erreichbar.";
    }
  });

  // ✅ Gastbutton
  document.getElementById("guestBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("kino_token");
    localStorage.removeItem("kino_user");
    window.location.href = "index.html";
  });
});