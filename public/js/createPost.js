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

  function clearErrors(form) {
    form
      .querySelectorAll(".error-message")
      .forEach((div) => (div.textContent = ""));
  }
  function showError(el, message) {
    const container = el.closest(".form-group") || el.parentElement;
    const errDiv = container.querySelector(".error-message");
    if (errDiv) errDiv.textContent = message;
  }

  forumFormContainer.style.display = "none";
  pollFormContainer.style.display = "none";
  addNewTagBtn.style.display = "none";
  newTagDiv.style.display = "none";

  createForumBtn.addEventListener("click", () => {
    forumFormContainer.style.display = "block";
    pollFormContainer.style.display = "none";

    const forumTagGroup = forumForm
      .querySelector("#tags")
      .closest(".form-group");
    forumTagGroup.appendChild(addNewTagBtn);
    forumTagGroup.appendChild(newTagDiv);

    addNewTagBtn.style.display = "inline-block";
    newTagDiv.style.display = "none";
  });

  createPollBtn.addEventListener("click", () => {
    forumFormContainer.style.display = "none";
    pollFormContainer.style.display = "block";

    const pollTagGroup = pollForm
      .querySelector("#pollTags")
      .closest(".form-group");
    pollTagGroup.appendChild(addNewTagBtn);
    pollTagGroup.appendChild(newTagDiv);

    addNewTagBtn.style.display = "inline-block";
    newTagDiv.style.display = "none";
  });

  addNewTagBtn.addEventListener("click", () => {
    newTagDiv.style.display = "block";
    newTagInput.value = "";
    newTagInput
      .closest(".form-group")
      .querySelector(".error-message").textContent = "";
    newTagInput.focus();
  });

  newTagInput.addEventListener("input", () => {
    newTagInput
      .closest(".form-group")
      .querySelector(".error-message").textContent = "";
  });

  saveTagBtn.addEventListener("click", async () => {
    const tagRaw = newTagInput.value.trim();
    const tagValue = tagRaw.toUpperCase();

    if (!tagRaw) {
      showError(newTagInput, "Please enter a tag name.");
      newTagInput.focus();
      return;
    }
    if (/[^A-Za-z0-9 ]/.test(tagRaw)) {
      showError(
        newTagInput,
        "Tags can only contain letters, numbers, and spaces."
      );
      newTagInput.focus();
      return;
    }

    const existing = Array.from(forumSelect.options).map((opt) =>
      opt.textContent.toUpperCase()
    );
    if (existing.includes(tagValue)) {
      showError(newTagInput, "This tag already exists.");
      newTagInput.focus();
      return;
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

  const forumImageInput = forumForm.querySelector("#images");
  const pollImageInput = pollForm.querySelector("#pollImages");

  function attachImageValidator(inputEl, formEl) {
    inputEl.addEventListener("change", () => {
      clearErrors(formEl);
      if (inputEl.files.length > 5) {
        showError(
          inputEl,
          `You can only upload up to 5 images (you selected ${inputEl.files.length}).`
        );
      }
    });
  }

  attachImageValidator(forumImageInput, forumForm);
  attachImageValidator(pollImageInput, pollForm);

  forumForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors(forumForm);

    if (forumImageInput.files.length > 5) {
      showError(
        forumImageInput,
        `You can only upload up to 5 images (you selected ${forumImageInput.files.length}).`
      );
      return;
    }

    const submitBtn = forumForm.querySelector(".submit-post-button");
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting…";

    const titleEl = forumForm.querySelector("#title");
    const contentEl = forumForm.querySelector("#content");

    if (!titleEl.value.trim()) {
      showError(titleEl, "Title is mandatory");
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Forum Post";
      return;
    }
    if (!contentEl.value.trim()) {
      showError(contentEl, "Content is mandatory");
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Forum Post";
      return;
    }

    try {
      const formData = new FormData(forumForm);
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
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Forum Post";
    }
  });

  document.getElementById("add-option").addEventListener("click", () => {
    const wrapper = document.getElementById("options-wrapper");
    const idx = wrapper.querySelectorAll(".option-row").length + 1;
    const row = document.createElement("div");
    row.className = "option-row flex gap-2 mb-2";
    row.innerHTML = `
      <input name="options[]" type="text" placeholder="Option ${idx}" />
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

  pollForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors(pollForm);

    if (pollImageInput.files.length > 5) {
      showError(
        pollImageInput,
        `You can only upload up to 5 images (you selected ${pollImageInput.files.length}).`
      );
      return;
    }

    const submitBtn = pollForm.querySelector(".submit-post-button");
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting…";

    const questionEl = pollForm.querySelector("#question");
    if (!questionEl.value.trim()) {
      showError(questionEl, "Poll question is mandatory");
      submitBtn.disabled = false;
      submitBtn.textContent = "Create Poll";
      return;
    }

    const optionEls = pollForm.querySelectorAll('input[name="options[]"]');
    for (let i = 0; i < optionEls.length; i++) {
      if (!optionEls[i].value.trim()) {
        const optsWrapper = pollForm.querySelector("#options-wrapper");
        showError(optsWrapper, `Option ${i + 1} cannot be empty`);
        submitBtn.disabled = false;
        submitBtn.textContent = "Create Poll";
        return;
      }
    }

    try {
      const formData = new FormData(pollForm);
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
      submitBtn.disabled = false;
      submitBtn.textContent = "Create Poll";
    }
  });
});
