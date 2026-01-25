document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:4040";

  const registerForm = document.querySelector('form[data-auth="register"]');
  const loginForm = document.querySelector('form[data-auth="login"]');

  async function postJson(path, body) {
    const res = await fetch(API_BASE + path, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(body)
    });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { ok:false, message:text }; }
    return { ok: res.ok, status: res.status, data };
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(registerForm);
      const body = {
        username: fd.get("username"),
        email: fd.get("email"),
        password: fd.get("password"),
        passwordConfirm: fd.get("passwordConfirm"),
      };
      const resp = await postJson("/api/auth/register", body);
      if (resp.ok && resp.data.ok) {
        alert(resp.data.message || "Registriert!");
        window.location.href = "login.html";
      } else {
        alert((resp.data && resp.data.message) ? resp.data.message : ("Fehler ("+resp.status+")"));
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(loginForm);
      const body = {
        username: fd.get("username"),
        password: fd.get("password"),
      };
      const resp = await postJson("/api/auth/login", body);
      if (resp.ok && resp.data.ok) {
        alert("Login erfolgreich");
        // später: Token/Session; erstmal Weiterleitung
        window.location.href = "index.html";
      } else {
        alert((resp.data && resp.data.message) ? resp.data.message : ("Fehler ("+resp.status+")"));
      }
    });
  }
});
