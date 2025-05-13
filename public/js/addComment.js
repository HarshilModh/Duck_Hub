document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".comment-form");
  const submitBtn = form.querySelector(".submit-comment-button");
  const contentEl = document.getElementById("content");
  const imagesInput = document.getElementById("images");

  function showError(inputEl, message) {
    let group = inputEl.closest(".form-group");
    let err = group.querySelector(".error-message");
    if (!err) {
      err = document.createElement("div");
      err.className = "error-message";
      err.style.color = "red";
      err.style.marginTop = "0.25rem";
      group.appendChild(err);
    }
    err.textContent = message;
  }

  function clearError(inputEl) {
    let group = inputEl.closest(".form-group");
    let err = group.querySelector(".error-message");
    if (err) err.remove();
  }
  imagesInput.addEventListener("change", () => {
    clearError(imagesInput);
    if (imagesInput.files.length > 5) {
      showError(
        imagesInput,
        `You can only upload up to 5 images (you selected ${imagesInput.files.length}).`
      );
    }
  });

  form.addEventListener("submit", (e) => {
    clearError(contentEl);
    clearError(imagesInput);

    let hasError = false;

    if (!contentEl.value.trim()) {
      showError(contentEl, "Comment cannot be empty.");
      hasError = true;
    }

    if (imagesInput.files.length > 5) {
      showError(
        imagesInput,
        `You can only upload up to 5 images (you selected ${imagesInput.files.length}).`
      );
      hasError = true;
    }

    Array.from(imagesInput.files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        showError(imagesInput, `"${file.name}" is not a valid image.`);
        hasError = true;
      }
    });

    if (hasError) {
      e.preventDefault();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Posting…";
  });
});
