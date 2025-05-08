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

  // Toggle between Forum vs Poll
  createForumBtn.addEventListener("click", () => {
    forumFormContainer.style.display = "block";
    pollFormContainer.style.display = "none";
  });
  createPollBtn.addEventListener("click", () => {
    forumFormContainer.style.display = "none";
    pollFormContainer.style.display = "block";
  });

  // Show the "Add New Tag" input
  addNewTagBtn.addEventListener("click", () => {
    newTagDiv.style.display = "block";
    newTagInput.focus();
  });

  // Save new tag via AJAX and insert into selects
  saveTagBtn.addEventListener("click", async () => {
    const tagValue = newTagInput.value.trim().toUpperCase();

    if (!tagValue) {
      return alert("Please enter a tag name.");
    }

    if (!userId) {
      throw new Error("Cannot create a tag with logging in");
    }

    try {
      const res = await fetch("/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tagValue, userId: userId }),
      });

      const newTag = await res.json();
      if (!res.ok) {
        throw new Error(newTag.error || "Failed to create tag");
      }

      // Create option for each select and mark selected
      [forumSelect, pollSelect].forEach((selectEl) => {
        const opt = document.createElement("option");
        opt.value = newTag._id;
        opt.textContent = newTag.name;
        opt.selected = true;
        selectEl.appendChild(opt);
      });

      // Hide & reset the new-tag input
      newTagInput.value = "";
      newTagDiv.style.display = "none";
    } catch (err) {
      console.error("Error creating tag:", err);
      alert("Error creating tag: " + err.message);
    }
  });

  // Submit forum form
  forumForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(forumForm);
    try {
      const response = await fetch("/forums", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const contentType = response.headers.get("Content-Type") || "";
        let payload;
        if (contentType.includes("application/json")) {
          payload = await response.json();
          throw new Error(payload.error || JSON.stringify(payload));
        } else {
          const text = await response.text();
          throw new Error(text);
        }
      }
      alert("Forum post created successfully!");
      window.location.href = "/forums";
    } catch (err) {
      console.error("Error submitting forum:", err);
      alert(err.message || "Failed to create forum.");
    }
  });

  // Add/remove poll options
  document.getElementById("add-option").addEventListener("click", () => {
    const wrapper = document.getElementById("options-wrapper");
    const idx = wrapper.querySelectorAll(".option-row").length + 1;
    const row = document.createElement("div");
    row.className = "option-row flex gap-2 mb-2";
    row.innerHTML = `
      <input name="options" type="text" required placeholder="Option ${idx}" />
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

  // Submit poll form
  pollForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(pollForm);
    try {
      const response = await fetch("/polls", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const contentType = response.headers.get("Content-Type") || "";
        let payload;
        if (contentType.includes("application/json")) {
          payload = await response.json();
          throw new Error(payload.error || JSON.stringify(payload));
        } else {
          const text = await response.text();
          throw new Error(text);
        }
      }
      window.location.href = "/forums";
    } catch (err) {
      console.error("Error submitting poll:", err);
      alert(err.message || "Failed to create poll.");
    }
  });
});
