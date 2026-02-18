(function () {
  const loginBtn = document.getElementById("Login-btn-non-autenthicated");
  const kontoBtn = document.getElementById("Login-btn-autenthicated");

  const token = localStorage.getItem("kino_token");

  const isLoggedIn = !!token; // einfach: Token vorhanden = eingeloggt

  if (loginBtn) loginBtn.style.display = isLoggedIn ? "none" : "inline-block";
  if (kontoBtn) kontoBtn.style.display = isLoggedIn ? "inline-block" : "none";
})();
