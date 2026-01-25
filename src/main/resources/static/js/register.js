document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:4040";

  const form = document.getElementById("registerForm");
  const err = document.getElementById("regError");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    err.textContent = "";

    const username = document.getElementById("regUsername").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const passwordConfirm = document.getElementById("regPasswordConfirm").value;

    if (password !== passwordConfirm) {
      err.textContent = "Passwörter stimmen nicht überein.";
      return;
    }

    try {
      const res = await fetch(API_BASE + "/api/auth/register", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ username, email, password, passwordConfirm })
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || ("Register fehlgeschlagen (" + res.status + ")"));
      }

      const user = await res.json();
      localStorage.setItem("kino_user", JSON.stringify(user));

      window.location.href = "index.html";
    } catch (e2) {
      err.textContent = e2.message || "Registrierung fehlgeschlagen";
    }
  });
});
