// public/js/userForums.js

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
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const postCard = button.closest(".forum-post-card");
        postCard.remove();
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

// ----- EDIT POST (Modal) -----
document.addEventListener("DOMContentLoaded", () => {
  const editModal = document.getElementById("editModal");
  const editForm = document.getElementById("editPostForm");
  const titleInput = document.getElementById("editTitle");
  const contentInput = document.getElementById("editContent");
  const existingImagesContainer = document.getElementById(
    "existingImagesContainer"
  );
  const newImagesInput = document.getElementById("editImages"); // your file‑input
  const closeBtn = document.getElementById("editModalClose");
  const cancelBtn = document.getElementById("editModalCancel");

  let imagesToDelete = [];

  // Create (or grab) hidden input to send deleted image URLs
  let deleteInput = document.getElementById("deleteImagesInput");
  if (!deleteInput) {
    deleteInput = document.createElement("input");
    deleteInput.type = "hidden";
    deleteInput.name = "deleteImages";
    deleteInput.id = "deleteImagesInput";
    editForm.appendChild(deleteInput);
  }
  // On form submit, store the deletion list
  editForm.addEventListener("submit", () => {
    deleteInput.value = JSON.stringify(imagesToDelete);
  });

  function openModal() {
    editModal.classList.remove("hidden");
  }
  function closeModal() {
    editModal.classList.add("hidden");
    imagesToDelete = []; // reset on close
  }

  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  document.querySelectorAll(".edit-button").forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      const postId = button.getAttribute("data-id");

      try {
        const res = await fetch(`/forums/${postId}`);
        if (!res.ok) throw new Error("Network response was not ok");
        const post = await res.json();

        // Populate title & content
        titleInput.value = post.title;
        contentInput.value = post.content;

        // Show existing images with a '×' to remove
        existingImagesContainer.innerHTML = "";
        imagesToDelete = [];
        if (post.imageURLs && post.imageURLs.length) {
          post.imageURLs.forEach((url) => {
            const wrapper = document.createElement("div");
            wrapper.classList.add("existing-image-wrapper");
            wrapper.dataset.url = url;
            wrapper.style.position = "relative";

            // Remove button
            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.classList.add("remove-existing-image");
            removeBtn.textContent = "×";
            removeBtn.style.position = "absolute";
            removeBtn.style.top = "4px";
            removeBtn.style.right = "4px";
            removeBtn.addEventListener("click", () => {
              imagesToDelete.push(url);
              wrapper.remove();
            });

            // Thumbnail
            const img = document.createElement("img");
            img.src = url;
            img.classList.add("modal-preview-image");

            wrapper.append(removeBtn, img);
            existingImagesContainer.appendChild(wrapper);
          });
        }

        // Clear any previously selected new files
        if (newImagesInput) newImagesInput.value = "";

        // Set form action to PUT route
        editForm.action = `/forums/${postId}?_method=PUT`;

        openModal();
      } catch (err) {
        console.error(err);
        alert("Failed to load post data for editing.");
      }
    });
  });
});
