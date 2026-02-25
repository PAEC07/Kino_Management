(function () {
  const token = localStorage.getItem("kino_token");
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("kino_user") || "null");
  } catch {
    user = null;
  }

  // nicht eingeloggt -> login
  if (!token || !user?.id) {
    window.location.replace("login.html");
    return;
  }

  // optional: admin -> Admin.html
  if ((user.role || "").toUpperCase() === "ADMIN") {
    window.location.replace("Admin.html");
    return;
  }
})();