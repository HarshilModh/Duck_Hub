// public/js/academicResourceLanding.js

document.addEventListener("DOMContentLoaded", () => {
  // ── SEARCH, SORT & FILTER VALIDATION ─────────────────────────────
  const searchForm = document.getElementById("searchForm");
  const searchInput = searchForm.querySelector("input[name='text']");

  // Create inline error element for search if not present
  let searchError = document.getElementById("searchError");
  if (!searchError) {
    searchError = document.createElement("div");
    searchError.id = "searchError";
    searchError.className = "error-message";
    searchError.style.color = "red";
    searchError.style.marginTop = "0.25rem";
    searchInput.insertAdjacentElement("afterend", searchError);
  }

  searchForm.addEventListener("submit", (e) => {
    const q = searchInput.value.trim();

    // 1) Require at least 3 characters
    if (q.length < 3) {
      e.preventDefault();
      searchError.textContent = "Please enter at least 3 characters to search.";
      searchInput.value = "";
      searchInput.focus();
      return;
    }
    searchError.textContent = "";
  });

  // —— FILTER VALIDATION ——
  const filterForm = document.getElementById("categoryFilterForm");
  const categorySelect = filterForm.querySelector("select[name='category']");

  // Create inline error element if it doesn't exist
  let filterError = document.getElementById("filterError");
  if (!filterError) {
    filterError = document.createElement("div");
    filterError.id = "filterError";
    filterError.className = "error-message";
    filterError.style.color = "red";
    filterError.style.marginTop = "0.25rem";
    categorySelect.insertAdjacentElement("afterend", filterError);
  }

  filterForm.addEventListener("submit", (e) => {
    const val = categorySelect.value.trim();

    if (val !== "" && !/^[0-9a-fA-F]{24}$/.test(val)) {
      e.preventDefault();
      filterError.textContent = "Invalid category selected.";
      categorySelect.focus();
    } else {
      filterError.textContent = "";
    }
  });
  // ---------------- Delete Resource Logic ------------------------
  const deleteButtons = document.querySelectorAll(".delete-button");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.id;
      if (!id) return console.error("Delete button missing data-id");
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

  // ----- REPORT MODAL LOGIC -----
  const reportButtons = document.querySelectorAll(".report-button");
  const reportModal = document.getElementById("reportModal");
  const reportForm = document.getElementById("reportForm");
  const reportContentIdInput = document.getElementById("reportContentId");
  const reportReason = document.getElementById("reportReason");
  const reportError = document.getElementById("reportError");
  const reportCancelBtn = document.getElementById("reportCancel");

  // Open modal
  reportButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      reportContentIdInput.value = e.currentTarget.dataset.id;
      reportError.style.display = "none";
      reportError.textContent = "";
      reportReason.value = "";
      reportModal.style.display = "flex";
    });
  });

  // Close on Cancel
  reportCancelBtn.addEventListener("click", () => {
    reportModal.style.display = "none";
    reportForm.reset();
    reportError.style.display = "none";
  });

  // Close when clicking outside the modal-card
  reportModal.addEventListener("click", (e) => {
    if (e.target === reportModal) {
      reportModal.style.display = "none";
      reportForm.reset();
      reportError.style.display = "none";
    }
  });

  // Client‑side validation on submit
  reportForm.addEventListener("submit", (e) => {
    const reasonText = reportReason.value.trim();

    // Check empty or too short
    if (!reasonText) {
      e.preventDefault();
      reportError.textContent = "Please enter a reason for reporting.";
      reportError.style.display = "block";
      reportReason.value = "";
    } else if (reasonText.length < 10) {
      e.preventDefault();
      reportError.textContent = "Reason must be at least 10 characters long.";
      reportError.style.display = "block";
      reportReason.value = "";
    }
  });

  // -------------------- Voting Logic -------------------------------
  const upvoteButtons = document.querySelectorAll(".upvote-button");
  const downvoteButtons = document.querySelectorAll(".downvote-button");

  upvoteButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const resourceId = e.currentTarget.dataset.id;
      if (!loggedInUserId) return alert("Please log in to vote.");
      try {
        const response = await fetch(
          `/academicResources/upvote/${resourceId}`,
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
      const resourceId = e.currentTarget.dataset.id;
      if (!loggedInUserId) return alert("Please log in to vote.");
      try {
        const response = await fetch(
          `/academicResources/downvote/${resourceId}`,
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

  // ------------------ Tag Creation Modal Logic ---------------------
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
});
