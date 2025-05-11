// public/js/userForums.js

// ————————— DELETE LOGIC (unchanged) —————————
document.querySelectorAll(".delete-button").forEach(button => {
  button.addEventListener("click", async e => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this?")) return;

    const forumId   = button.dataset.id;
    const type = button.dataset.type;  


    try {
      const res = await fetch(`/forums/${forumId}`, { method: "DELETE" });
      if (res.ok) {
        const selector = type === "poll"
          ? ".poll-post-card"
          : ".forum-post-card";
        button.closest(selector)?.remove();
      } else {
        const err = await res.json();
        alert("Delete failed: " + (err.error || res.statusText));
      }
    } catch(err) {
      console.error(err);
      alert("Something went wrong deleting.");
    }
  });
});

// ————————— EDIT MODAL LOGIC —————————
const editModal       = document.getElementById("editModal");
const closeModalBtn   = editModal.querySelector(".modal-close");
const cancelEditBtn   = document.getElementById("editCancel");
const editForm        = document.getElementById("editForm");
const existingImages  = document.getElementById("existing-images");
const currentTags     = document.getElementById("current-tags");
const newTagsSelect   = document.getElementById("new-tags");

let currentEditId = null;

// 1) Open & populate the edit modal when an edit-button is clicked
document.querySelectorAll(".edit-button").forEach(btn => {
  btn.addEventListener("click", async e => {
    e.preventDefault();
    const postId = btn.dataset.id;
    currentEditId = postId;

    try {
      // use your GET /:id endpoint
      const res = await fetch(`/forums/${postId}`);
      if (!res.ok) throw new Error("Failed to load post data");
      const post = await res.json();

      // Fill form fields
      document.getElementById("edit-title").value   = post.title;
      document.getElementById("edit-content").value = post.content;

      // Render existing images
      existingImages.innerHTML = "";
      post.imageURLs.forEach((url, idx) => {
        const wrapper = document.createElement("div");
        wrapper.className = "image-wrapper";

        const img = document.createElement("img");
        img.src = url;
        img.className = "forum-image";

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "remove-image";
        removeBtn.textContent = "×";
        removeBtn.dataset.index = idx;

        wrapper.append(img, removeBtn);
        existingImages.append(wrapper);
      });

      // Render current tags (by name)
      currentTags.innerHTML = "";
      (post.tags || []).forEach(tag => {
        const span = document.createElement("span");
        span.className = "tag-badge";
        span.textContent = tag.name;
        currentTags.append(span);
      });

      // Clear previously selected new-tags
      Array.from(newTagsSelect.options).forEach(opt => {
        opt.selected = false;
      });

      // Show modal
      editModal.classList.remove("hidden");
    } catch (err) {
      console.error(err);
      alert("Unable to load post for editing.");
    }
  });
});

// 2) Close modal
closeModalBtn.addEventListener("click", () => {
  editModal.classList.add("hidden");
});
cancelEditBtn.addEventListener("click", () => {
  editModal.classList.add("hidden");
});

// 3) Toggle mark-to-delete on existing images
existingImages.addEventListener("click", e => {
  if (!e.target.classList.contains("remove-image")) return;
  const wrapper = e.target.closest(".image-wrapper");
  wrapper.classList.toggle("to-delete");
  // Change symbol: × <-> ↺
  e.target.textContent = wrapper.classList.contains("to-delete") ? "↺" : "×";
});

// 4) Submit edited data via AJAX (PUT /forums/:id)
editForm.addEventListener("submit", async e => {
  e.preventDefault();
  if (!currentEditId) return alert("No post selected");

  const formData = new FormData(editForm);

  // Append deleted image indices
  existingImages.querySelectorAll(".image-wrapper.to-delete").forEach(w => {
    formData.append("deleteImageIds", w.querySelector(".remove-image").dataset.index);
  });

  // The <select name="newTags" multiple> and
  // <input type="file" name="newImages" multiple> are
  // already in the FormData by default.

  try {
    const res = await fetch(`/forums/${currentEditId}`, {
      method: "PUT",
      body: formData
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Update failed");
    }
    // on success, refresh page or update card
    location.reload();
  } catch (err) {
    console.error(err);
    alert("Failed to save edits: " + err.message);
  }
});