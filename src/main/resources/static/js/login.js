document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:8080";

  const form = document.getElementById("loginForm");
  const err = document.getElementById("loginError");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    err.textContent = "";

    const username = document.getElementById("loginUsername")?.value.trim();
    const password = document.getElementById("loginPassword")?.value;

    if (!username || !password) {
      err.textContent = "Bitte Benutzername und Passwort eingeben.";
      return;
    }

    try {
      const res = await fetch(API_BASE + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        err.textContent = data.message || "Login fehlgeschlagen.";
        return;
      }

      // ✅ NUR den Benutzer speichern
      localStorage.setItem("kino_user", JSON.stringify(data.user));

      // Optional: Token später
      // localStorage.setItem("kino_token", data.token);

      window.location.href = "index.html";
    } catch (e2) {
      console.error(e2);
      err.textContent = "Server nicht erreichbar.";
    }
  });
});
