// public/js/createAcademicResource.js
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    // === ELEMENTS ===
    const form = document.getElementById("forumForm");
    const formErrorsDiv = document.getElementById("formErrors");
    const titleInput = document.getElementById("title");
    const descInput = document.getElementById("description");
    const urlInput = document.getElementById("url");

    const tagInput = document.getElementById("tagInput");
    const suggestions = document.getElementById("tagSuggestions");
    const selectedDiv = document.getElementById("selectedTags");
    const newTagDiv = document.getElementById("newTagModal");
    const newTagBtn = document.getElementById("addTagBtn");
    const saveTagBtn = document.getElementById("saveNewTag");
    const newTagNameInput = document.getElementById("newTagName");
    const userIdInput = document.getElementById("userId");

    // preloaded in your template:
    // <script>const AVAILABLE_TAGS = {{{JSON.stringify(tags.map(t => ({ id: t._id, name: t.name })))}}};</script>
    let selectedTags = []; // { id, name }

    // === VALIDATION & SUBMIT HANDLER ===
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      formErrorsDiv.innerHTML = "";

      const title = titleInput.value;
      const desc = descInput.value;
      const url = urlInput.value;
      const errors = [];

      if (!title.trim()) {
        errors.push("Title cannot be empty or just spaces.");
      }
      if (!desc.trim()) {
        errors.push("Description cannot be empty or just spaces.");
      }
      if (!url.trim()) {
        errors.push("URL cannot be empty or just spaces.");
      }

      if (errors.length) {
        // show errors
        errors.forEach((msg) => {
          const p = document.createElement("p");
          p.textContent = msg;
          formErrorsDiv.appendChild(p);
        });
        // clear those fields
        titleInput.value = "";
        descInput.value = "";
        urlInput.value = "";
        return;
      }

      // if all good, go ahead and submit
      form.submit();
    });

    // === TAG UI HELPERS ===
    function debounce(fn, ms = 200) {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), ms);
      };
    }

    function renderSelectedTags() {
      selectedDiv.innerHTML = selectedTags
        .map(
          (t) => `
        <span class="tag-pill">
          ${t.name}
          <button type="button" class="remove-tag" data-id="${t.id}">&times;</button>
          <input type="hidden" name="tags" value="${t.id}">
        </span>
      `
        )
        .join("");
      bindRemoveClicks();
    }

    function bindRemoveClicks() {
      selectedDiv.querySelectorAll(".remove-tag").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.id;
          selectedTags = selectedTags.filter((t) => t.id !== id);
          renderSelectedTags();
        });
      });
    }

    function bindSuggestionClicks() {
      suggestions.querySelectorAll(".suggestion-item").forEach((item) => {
        item.addEventListener("click", () => {
          const id = item.dataset.id;
          const name = item.textContent;
          if (!selectedTags.some((t) => t.id === id)) {
            selectedTags.push({ id, name });
            renderSelectedTags();
          }
          tagInput.value = "";
          suggestions.innerHTML = "";
        });
      });
    }

    const showSuggestions = debounce(() => {
      const q = tagInput.value.trim().toLowerCase();
      if (!q) {
        suggestions.innerHTML = "";
        return;
      }
      const matches = AVAILABLE_TAGS.filter((t) =>
        t.name.toLowerCase().includes(q)
      ).slice(0, 10);
      suggestions.innerHTML = matches
        .map(
          (t) =>
            `<div class="suggestion-item" data-id="${t.id}">${t.name}</div>`
        )
        .join("");
      bindSuggestionClicks();
    });

    tagInput.addEventListener("input", showSuggestions);

    if (newTagBtn) {
      newTagBtn.addEventListener("click", () => {
        newTagDiv.style.display = "block";
        newTagNameInput.focus();
      });
    }

    if (saveTagBtn) {
      saveTagBtn.addEventListener("click", async () => {
        const tagValue = newTagNameInput.value.trim().toUpperCase();
        const userId = userIdInput.value;
        if (!tagValue) {
          return alert("Tag name can't be empty");
        }
        if (!userId) {
          return alert("You must be logged in to create a tag");
        }
        try {
          const res = await fetch("/tags", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: tagValue, userId }),
          });
          const newTag = await res.json();
          if (!res.ok) {
            throw new Error(newTag.error || "Failed to create tag");
          }
          AVAILABLE_TAGS.push({ id: newTag._id, name: newTag.name });
          selectedTags.push({ id: newTag._id, name: newTag.name });
          renderSelectedTags();
          newTagNameInput.value = "";
          newTagDiv.style.display = "none";
        } catch (err) {
          console.error("Error creating tag:", err);
          alert("Error creating tag: " + err.message);
        }
      });
    }
  });
})();
