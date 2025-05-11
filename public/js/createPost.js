// public/js/createPost.js
document.addEventListener("DOMContentLoaded", () => {
  const createForumBtn = document.getElementById("createForumBtn");
  const createPollBtn = document.getElementById("createPollBtn");
  const forumFormContainer = document.getElementById("forumFormContainer");
  const pollFormContainer = document.getElementById("pollFormContainer");
  const forumForm = document.getElementById("forumForm");
  const pollForm = document.getElementById("pollForm");

  const addNewTagBtn = document.getElementById("addTagBtn");
  const newTagDiv = document.getElementById("newTagDiv");
  const newTagInput = document.getElementById("newTagName");
  const saveTagBtn = document.getElementById("saveNewTag");

  const forumSelect = document.getElementById("tags");
  const pollSelect = document.getElementById("pollTags");
  const userId = document.getElementById("userId").value;

  // ── Utility for inline errors ─────────────────────────
  function clearErrors(form) {
    form.querySelectorAll(".error-message").forEach((div) => {
      div.textContent = "";
    });
  }
  function showError(el, message) {
    const container = el.closest(".form-group") || el.parentElement;
    const errDiv = container.querySelector(".error-message");
    if (errDiv) errDiv.textContent = message;
  }

  // ── Toggle between Forum vs Poll ───────────────────────
  createForumBtn.addEventListener("click", () => {
    forumFormContainer.style.display = "block";
    pollFormContainer.style.display = "none";
  });
  createPollBtn.addEventListener("click", () => {
    forumFormContainer.style.display = "none";
    pollFormContainer.style.display = "block";
  });

  // ── Add New Tag flow ───────────────────────────────────
  addNewTagBtn.addEventListener("click", () => {
    newTagDiv.style.display = "block";
    newTagInput.focus();
  });

  saveTagBtn.addEventListener("click", async () => {
    const tagValue = newTagInput.value.trim().toUpperCase();
    if (!tagValue) {
      return showError(newTagInput, "Please enter a tag name.");
    }
    if (!userId) {
      throw new Error("Cannot create a tag without logging in");
    }
    try {
      const res = await fetch("/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tagValue, userId }),
      });
      const newTag = await res.json();
      if (!res.ok) throw new Error(newTag.error || "Failed to create tag");

      [forumSelect, pollSelect].forEach((selectEl) => {
        const opt = document.createElement("option");
        opt.value = newTag._id;
        opt.textContent = newTag.name;
        opt.selected = true;
        selectEl.appendChild(opt);
      });

      newTagInput.value = "";
      newTagDiv.style.display = "none";
    } catch (err) {
      console.error("Error creating tag:", err);
      alert("Error creating tag: " + err.message);
    }
  });

  // ── FORUM: client‑side validation + submit ─────────────
  forumForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors(forumForm);

    // Title must not be empty
    const titleEl = forumForm.querySelector("#title");
    if (!titleEl.value.trim()) {
      showError(titleEl, "Title is mandatory");
      titleEl.value = "";
      return;
    }

    // Content must not be empty
    const contentEl = forumForm.querySelector("#content");
    if (!contentEl.value.trim()) {
      showError(contentEl, "Content is mandatory");
      contentEl.value = "";
      return;
    }

    // All good → send
    const formData = new FormData(forumForm);
    try {
      const response = await fetch("/forums", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const ct = response.headers.get("Content-Type") || "";
        const payload = ct.includes("application/json")
          ? await response.json()
          : await response.text();
        throw new Error(payload.error || payload);
      }
      alert("Forum post created successfully!");
      window.location.href = "/forums";
    } catch (err) {
      console.error("Error submitting forum:", err);
      alert(err.message || "Failed to create forum.");
    }
  });

  // ── Dynamic poll options add/remove ────────────────────
  document.getElementById("add-option").addEventListener("click", () => {
    const wrapper = document.getElementById("options-wrapper");
    const idx = wrapper.querySelectorAll(".option-row").length + 1;
    const row = document.createElement("div");
    row.className = "option-row flex gap-2 mb-2";
    row.innerHTML = `
      <input name="options[]" type="text" required placeholder="Option ${idx}" />
      <button type="button" class="remove-option">✕</button>
    `;
    wrapper.insertBefore(row, document.getElementById("add-option"));
  });
  document.getElementById("options-wrapper").addEventListener("click", (e) => {
    if (e.target.matches(".remove-option")) {
      const rows = document.querySelectorAll(".option-row");
      if (rows.length > 2) e.target.closest(".option-row").remove();
    }
  });

  // ── POLL: client‑side validation + submit ──────────────
  pollForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors(pollForm);

    // Question must not be empty
    const questionEl = pollForm.querySelector("#question");
    if (!questionEl.value.trim()) {
      showError(questionEl, "Poll question is mandatory");
      questionEl.value = "";
      return;
    }

    // Options must all be non‑empty
    const optsWrapper = pollForm.querySelector("#options-wrapper");
    const optionEls = pollForm.querySelectorAll('input[name="options[]"]');
    for (let i = 0; i < optionEls.length; i++) {
      if (!optionEls[i].value.trim()) {
        showError(optsWrapper, `Option ${i + 1} cannot be empty`);
        // clear all options so user re-enters
        optionEls.forEach((el) => (el.value = ""));
        return;
      }
    }

    // All good → send
    const formData = new FormData(pollForm);
    try {
      const response = await fetch("/polls", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const ct = response.headers.get("Content-Type") || "";
        const payload = ct.includes("application/json")
          ? await response.json()
          : await response.text();
        throw new Error(payload.error || payload);
      }
      window.location.href = "/forums";
    } catch (err) {
      console.error("Error submitting poll:", err);
      alert(err.message || "Failed to create poll.");
    }
  });
});
