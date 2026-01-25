document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("kino_token");
  const user = JSON.parse(localStorage.getItem("kino_user") || "null");

  const topbar = document.querySelector(".topbar-right");
  if (!topbar) return;

  const loginLink = topbar.querySelector('a[href="login.html"]');
  if (!loginLink) return;

  if (token && user) {
    loginLink.textContent = user.username;
    loginLink.href = "account.html";
  }
});
