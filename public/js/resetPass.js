document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirmPassword");

  let errorDiv = document.querySelector(".client-error");
  if (!errorDiv) {
    errorDiv = document.createElement("div");
    errorDiv.className = "alert alert-danger client-error";
    errorDiv.style.display = "none";
    form.prepend(errorDiv);
  }

  form.addEventListener("submit", (e) => {
    errorDiv.style.display = "none";

    const password = passwordInput.value.trim();
    const confirmPassword = confirmInput.value.trim();
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }

    const complexityRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!complexityRegex.test(password)) {
      errors.push(
        "Password must include at least one lowercase letter, one uppercase letter, one number, and one special character."
      );
    }

    if (password !== confirmPassword) {
      errors.push("Passwords do not match.");
    }

    if (errors.length) {
      e.preventDefault();
      errorDiv.innerHTML = errors.join("<br>");
      errorDiv.style.display = "block";
      passwordInput.value = "";
      confirmInput.value = "";
    }
  });
});
