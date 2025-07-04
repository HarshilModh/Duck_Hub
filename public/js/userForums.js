document.querySelectorAll(".delete-button").forEach((button) => {
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this?")) return;

    const id = button.dataset.id;
    const type = button.dataset.type;
    try {
      const res = await fetch(`/forums/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const selector =
          type === "poll" ? ".poll-post-card" : ".forum-post-card";
        button.closest(selector)?.remove();
      } else {
        const err = await res.json();
        alert("Delete failed: " + (err.error || res.statusText));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong deleting.");
    }
  });
});

const editModal = document.getElementById("editModal");
const closeModalBtn = editModal.querySelector(".modal-close");
const cancelEditBtn = document.getElementById("editCancel");
const editForm = document.getElementById("editForm");
const titleInput = document.getElementById("edit-title");
const contentInput = document.getElementById("edit-content");
const titleError = document.getElementById("title-error");
const contentError = document.getElementById("content-error");
const newTagsSelect = document.getElementById("new-tags");

let currentEditId = null;
let originalTitle = "";
let originalContent = "";

document.querySelectorAll(".edit-button").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    currentEditId = btn.dataset.id;
    try {
      const res = await fetch(`/forums/${currentEditId}`);
      if (!res.ok) throw new Error("Failed to load post data");
      const post = await res.json();

      originalTitle = post.title;
      originalContent = post.content;

      titleInput.value = originalTitle;
      contentInput.value = originalContent;

      Array.from(newTagsSelect.options).forEach(
        (opt) => (opt.selected = false)
      );

      titleError.textContent = "";
      contentError.textContent = "";

      editModal.classList.remove("hidden");
    } catch (err) {
      console.error(err);
      alert("Unable to load post for editing.");
    }
  });
});
closeModalBtn.addEventListener("click", () =>
  editModal.classList.add("hidden")
);
cancelEditBtn.addEventListener("click", () =>
  editModal.classList.add("hidden")
);

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  titleError.textContent = "";
  contentError.textContent = "";

  const titleVal = titleInput.value.trim();
  const contentVal = contentInput.value.trim();

  let hasError = false;

  if (!titleVal) {
    titleError.textContent = "Title cannot be empty.";
    titleInput.value = originalTitle;
    hasError = true;
  }

  if (!contentVal) {
    contentError.textContent = "Content cannot be empty.";
    contentInput.value = originalContent;
    hasError = true;
  }

  if (hasError) {
    if (!titleVal) titleInput.focus();
    else contentInput.focus();
    return;
  }

  const formData = new FormData(editForm);
  formData.set("title", titleVal);
  formData.set("content", contentVal);

  formData.delete("newTags");
  Array.from(newTagsSelect.selectedOptions).forEach((opt) => {
    formData.append("tags", opt.value);
  });

  try {
    const res = await fetch(`/forums/${currentEditId}`, {
      method: "PUT",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Update failed");
    }
    location.reload();
  } catch (err) {
    console.error(err);
    alert("Failed to save edits: " + err.message);
  }
});
