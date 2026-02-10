document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:8080";

  const registerForm = document.querySelector('form[data-auth="register"]');
  const loginForm = document.querySelector('form[data-auth="login"]');

  async function postJson(path, body) {
    const res = await fetch(API_BASE + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { ok: false, message: text };
    }

    return { ok: res.ok, status: res.status, data };
  }

  // REGISTER
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const fd = new FormData(registerForm);
      const body = {
        username: (fd.get("username") || "").toString().trim(),
        email: (fd.get("email") || "").toString().trim(),
        password: (fd.get("password") || "").toString(),
        passwordConfirm: (fd.get("passwordConfirm") || "").toString(),
      };

      if (!body.username || !body.email || !body.password) {
        alert("Bitte alle Felder ausfüllen.");
        return;
      }

      if (body.password !== body.passwordConfirm) {
        alert("Passwörter stimmen nicht überein.");
        return;
      }

      const resp = await postJson("/api/benutzer/register", body);

      if (resp.ok && resp.data.ok) {
        // Optional: direkt einloggen? (hier: nein, dann weiter zu login)
        alert(resp.data.message || "Registrierung erfolgreich!");
        window.location.href = "login.html";
      } else {
        alert(resp.data?.message || `Fehler (${resp.status})`);
      }
    });
  }

  // LOGIN
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const fd = new FormData(loginForm);
      const body = {
        username: (fd.get("username") || "").toString().trim(),
        password: (fd.get("password") || "").toString(),
      };

      const resp = await postJson("/api/benutzer/login", body);

      if (resp.ok && resp.data.ok) {
        // INFO: lokal merken, dass User eingeloggt ist
        // Da dein Backend nur {ok, message} liefert, speichern wir minimal:
        const kinoUser = {
          username: body.username,
          id: resp.data?.id, // Optional, falls du die ID zurückgibst
          loggedInAt: new Date().toISOString(),
        };
        localStorage.setItem("kino_user", JSON.stringify(kinoUser));

        window.location.href = "index.html";
      } else {
        alert(resp.data?.message || `Login fehlgeschlagen (${resp.status})`);
      }
    });
  }
});
