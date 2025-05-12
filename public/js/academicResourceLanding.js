(function () {
  const deleteButtons = document.querySelectorAll(".delete-button");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.id;
      if (!id) {
        console.error("Delete button missing data-id");
        return;
      }
      if (!confirm("Are you sure you want to delete this resource?")) {
        return;
      }

      try {
        const res = await fetch(`/academicResources/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          const { error } = await res.json();
          return alert(error || "Failed to delete resource.");
        }
        const card = button.closest(".forum-post-card");
        if (card) card.remove();
      } catch (err) {
        console.error("Error deleting resource:", err);
        alert("Something went wrong while deleting.");
      }
    });
  });

  const reportButtons = document.querySelectorAll(".report-button");
  const reportModal = document.getElementById("reportModal");
  const reportForm = document.getElementById("reportForm");
  const reportContentIdInput = document.getElementById("reportContentId");
  const reportCancelBtn = document.getElementById("reportCancel");

  reportButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      reportContentIdInput.value = e.currentTarget.dataset.id;
      reportModal.style.display = "flex";
    });
  });

  reportCancelBtn.addEventListener("click", () => {
    reportModal.style.display = "none";
    reportForm.reset();
  });

  reportModal.addEventListener("click", (e) => {
    if (e.target === reportModal) {
      reportModal.style.display = "none";
      reportForm.reset();
    }
  });

  const upvoteButtons = document.querySelectorAll(".upvote-button");
  const downvoteButtons = document.querySelectorAll(".downvote-button");

  upvoteButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const academicResourceId = e.currentTarget.dataset.id;
      if (!loggedInUserId) return alert("Please log in to vote.");
      try {
        const response = await fetch(
          `/academicResources/upvote/${academicResourceId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: loggedInUserId }),
          }
        );
        if (response.ok || response.status === 400) window.location.reload();
        else {
          const { error } = await response.json();
          alert(error);
        }
      } catch (err) {
        console.error("Error while upvoting:", err);
      }
    });
  });

  downvoteButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const academicResourceId = e.currentTarget.dataset.id;
      if (!loggedInUserId) return alert("Please log in to vote.");
      try {
        const response = await fetch(
          `/academicResources/downvote/${academicResourceId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: loggedInUserId }),
          }
        );
        if (response.ok || response.status === 400) window.location.reload();
        else {
          const { error } = await response.json();
          alert(error);
        }
      } catch (err) {
        console.error("Error while downvoting:", err);
      }
    });
  });

  const openTagModalBtn = document.getElementById("openTagModal");
  const tagModal = document.getElementById("tagModal");
  const tagCancelBtn = document.getElementById("tagCancel");
  const tagForm = document.getElementById("tagForm");
  const tagNameInput = document.getElementById("tagName");

  const tagError = document.createElement("p");
  tagError.id = "tagError";
  tagError.style.color = "red";
  tagError.style.marginTop = "0.25rem";

  openTagModalBtn.addEventListener("click", (e) => {
    e.preventDefault();
    tagError.remove();
    tagForm.reset();
    tagModal.style.display = "flex";
  });

  tagCancelBtn.addEventListener("click", () => {
    tagModal.style.display = "none";
    tagForm.reset();
    tagError.remove();
  });

  tagModal.addEventListener("click", (e) => {
    if (e.target === tagModal) {
      tagModal.style.display = "none";
      tagForm.reset();
      tagError.remove();
    }
  });

  tagForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = tagNameInput.value.trim();
    if (!name) {
      if (
        !tagNameInput.nextElementSibling ||
        tagNameInput.nextElementSibling.id !== "tagError"
      ) {
        tagNameInput.insertAdjacentElement("afterend", tagError);
      }
      tagError.textContent = "Tag name cannot be empty or just spaces.";
      return;
    }
    tagError.remove();
    tagForm.submit();
  });
})();
