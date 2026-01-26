document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:8080";

  const form = document.getElementById("loginForm");
  const err = document.getElementById("loginError");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    err.textContent = "";

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    try {
      const res = await fetch(API_BASE + "/api/auth/login", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || ("Login fehlgeschlagen (" + res.status + ")"));
      }

      const user = await res.json();
      localStorage.setItem("kino_user", JSON.stringify(user));

      // zurück zur Startseite
      window.location.href = "index.html";
    } catch (e2) {
      err.textContent = e2.message || "Login fehlgeschlagen";
    }
  });
});
