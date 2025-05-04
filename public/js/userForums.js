// userForums.js

// ----- DELETE POST -----
document.querySelectorAll(".delete-button").forEach((button) => {
  button.addEventListener("click", async (e) => {
    e.preventDefault();

    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    const forumId = button.getAttribute("data-id");

    try {
      const response = await fetch(`/forums/${forumId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const postCard = button.closest(".forum-post-card");
        postCard.remove();
        console.log(`Post ${forumId} deleted successfully.`);
      } else {
        const error = await response.json();
        alert("Failed to delete post: " + (error.error || response.statusText));
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Something went wrong while deleting the post.");
    }
  });
});

// ----- EDIT POST -----
document.querySelectorAll(".edit-button").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    enterEditMode(button.getAttribute("data-id"));
  });
});

function enterEditMode(id) {
  const card = document.getElementById(`forumPost-${id}`);
  const titleEl = card.querySelector(".forum-title");
  const contentEl = card.querySelector(".forum-content");
  const tagsEl = card.querySelector(".forum-tags");

  // grab existing values
  const currentTitle = titleEl.textContent.trim();
  const currentContent = contentEl.textContent.trim();
  const existingTags = tagsEl ? tagsEl.textContent.trim() : "";

  // hide display elements
  titleEl.style.display = "none";
  contentEl.style.display = "none";
  if (tagsEl) tagsEl.style.display = "none";
  card.querySelector(".post-actions").style.display = "none";

  // build inputs
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = currentTitle;
  titleInput.classList.add("edit-input-title");

  const contentInput = document.createElement("textarea");
  contentInput.rows = 4;
  contentInput.value = currentContent;
  contentInput.classList.add("edit-input-content");

  const tagsInput = document.createElement("input");
  tagsInput.type = "text";
  tagsInput.placeholder = "comma‑separated tags";
  tagsInput.value = existingTags;
  tagsInput.classList.add("edit-input-tags");

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.multiple = true;
  fileInput.accept = "image/*";
  fileInput.classList.add("edit-input-images");

  // action buttons
  const btnUpdate = document.createElement("button");
  btnUpdate.textContent = "Update";
  btnUpdate.addEventListener("click", () => submitUpdate(id));

  const btnCancel = document.createElement("button");
  btnCancel.textContent = "Cancel";
  btnCancel.addEventListener("click", () => window.location.reload());

  // wrapper for form fields
  const formWrapper = document.createElement("div");
  formWrapper.classList.add("edit-form-wrapper");
  formWrapper.style.marginTop = "1rem";
  formWrapper.append(
    labeledField("Title:", titleInput),
    labeledField("Content:", contentInput),
    labeledField("Tags:", tagsInput),
    labeledField("Add Images:", fileInput),
    btnUpdate,
    btnCancel
  );

  card.appendChild(formWrapper);
}

function labeledField(labelText, inputEl) {
  const wrapper = document.createElement("div");
  wrapper.style.margin = "0.5rem 0";
  const lbl = document.createElement("label");
  lbl.textContent = labelText;
  wrapper.append(lbl, inputEl);
  return wrapper;
}

async function submitUpdate(id) {
  const card = document.getElementById(`forumPost-${id}`);
  const title = card.querySelector(".edit-input-title").value;
  const content = card.querySelector(".edit-input-content").value;
  const tagsCsv = card.querySelector(".edit-input-tags").value;
  const tags = tagsCsv
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const files = card.querySelector(".edit-input-images").files;

  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  tags.forEach((tag) => formData.append("tags", tag));
  Array.from(files).forEach((file) => formData.append("images", file));

  try {
    const res = await fetch(`/forums/${id}`, {
      method: "PUT",
      body: formData,
      credentials: "same-origin",
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const updated = await res.json();

    // update UI or reload to reflect changes
    window.location.reload();
  } catch (err) {
    console.error("Update failed:", err);
    alert("Failed to update post: " + err.message);
  }
}
