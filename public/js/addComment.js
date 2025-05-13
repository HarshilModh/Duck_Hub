document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".comment-form");
  const submitBtn = form.querySelector(".submit-comment-button");

  form.addEventListener("submit", (e) => {
    // clear any previous errors
    let errorContainer = document.querySelector("#commentFormErrors");
    if (errorContainer) {
      errorContainer.remove();
    }

    const errors = [];
    const contentEl = document.getElementById("content");
    const content = contentEl.value.trim();
    if (!content) {
      errors.push("Comment cannot be empty.");
    }

    const imagesInput = document.getElementById("images");
    const files = imagesInput.files;
    if (files.length > 5) {
      errors.push("You can attach a maximum of 5 images.");
    }
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        errors.push(`"${file.name}" is not a valid image file.`);
      }
    }

    if (errors.length) {
      e.preventDefault();
      // show errors
      errorContainer = document.createElement("div");
      errorContainer.id = "commentFormErrors";
      errorContainer.style.color = "red";
      errorContainer.style.marginBottom = "1rem";

      const ul = document.createElement("ul");
      errors.forEach((msg) => {
        const li = document.createElement("li");
        li.textContent = msg;
        ul.appendChild(li);
      });
      errorContainer.appendChild(ul);
      form.insertBefore(errorContainer, form.firstElementChild);

      return; // don’t disable button if validation failed
    }

    // disable the button immediately to prevent double-submits
    submitBtn.disabled = true;
    submitBtn.textContent = "Posting…";
  });
});
