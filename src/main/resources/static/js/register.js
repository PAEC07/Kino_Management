document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:8080";

  const form = document.getElementById("registerForm");
  const err = document.getElementById("regError");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    err.textContent = "";

    const username = document.getElementById("regUsername")?.value.trim();
    const email = document.getElementById("regEmail")?.value.trim();
    const password = document.getElementById("regPassword")?.value;
    const passwordConfirm = document.getElementById("regPasswordConfirm")?.value;

    if (!username || !email || !password || !passwordConfirm) {
      err.textContent = "Bitte alle Felder ausfüllen.";
      return;
    }

    if (password !== passwordConfirm) {
      err.textContent = "Passwörter stimmen nicht überein.";
      return;
    }

    try {
      const res = await fetch(API_BASE + "/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          passwordConfirm
        })
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        err.textContent = data.message || "Registrierung fehlgeschlagen.";
        return;
      }

      // ✅ Automatisch einloggen nach Registrierung
      localStorage.setItem("kino_user", JSON.stringify(data.user));

      window.location.href = "index.html";
    } catch (e2) {
      console.error(e2);
      err.textContent = "Server nicht erreichbar.";
    }
  });
});
