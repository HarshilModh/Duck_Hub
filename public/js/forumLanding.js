document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const postTypeSelect = document.getElementById("postTypeSelect");
  const sortSelect = document.getElementById("sortSelect");
  const orderSelect = document.getElementById("orderSelect");
  const errorEl = document.getElementById("formError");

  const VALID_POST_TYPES = ["all", "forums", "polls"];
  const VALID_SORTS = ["createdAt", "upVotes", "downVotes"];
  const VALID_ORDERS = ["asc", "desc"];

  form.addEventListener("submit", (e) => {
    const btn = e.submitter;

    // ── SEARCH ───────────────────────────────────────
    if (btn.classList.contains("search-button")) {
      form.action = "/forums/search";

      // require at least 3 characters
      const q = searchInput.value.trim();
      if (q.length < 3) {
        e.preventDefault();
        errorEl.textContent = "Please enter at least 3 characters to search.";
        searchInput.value = "";
        searchInput.focus();
        return;
      }

      // clear error
      errorEl.textContent = "";

      // ── FILTER + SORT ────────────────────────────────
    } else if (btn.classList.contains("filter-button")) {
      form.action = "/forums/filter";

      // validate postType
      const pt = postTypeSelect.value;
      if (!VALID_POST_TYPES.includes(pt)) {
        e.preventDefault();
        errorEl.textContent =
          "Please select All, Forums, or Polls before filtering.";
        return;
      }

      // validate sort field
      const s = sortSelect.value;
      if (!VALID_SORTS.includes(s)) {
        e.preventDefault();
        errorEl.textContent = "Invalid sort field selected.";
        return;
      }

      // validate order direction
      const o = orderSelect.value;
      if (!VALID_ORDERS.includes(o)) {
        e.preventDefault();
        errorEl.textContent = "Invalid order direction selected.";
        return;
      }

      // clear error
      errorEl.textContent = "";
    }

    // for any other button, just let the form submit
  });

  // ------------------------ Delete Post Logic ------------------------
  document.querySelectorAll(".delete-button").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const postId = btn.dataset.id;
      const type = btn.dataset.type; // "Forum" or "Poll"
      if (!postId) return;

      if (!confirm("Are you sure you want to delete this post?")) {
        return;
      }

      try {
        const res = await fetch(`/forums/${postId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (res.ok) {
          const selector =
            type === "Poll" ? ".poll-post-card" : ".forum-post-card";
          btn.closest(selector)?.remove();
        } else {
          console.error(data.message || "Delete failed");
          alert(data.message || "Failed to delete post.");
        }
      } catch (err) {
        console.error("Error deleting post:", err);
        alert("Something went wrong while deleting.");
      }
    });
  });

  const upvoteButtons = document.querySelectorAll(".upvote-button");
  const downvoteButtons = document.querySelectorAll(".downvote-button");
  const commentButtons = document.querySelectorAll(".comment-button");

  commentButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const forumId = button.dataset.id;
      if (forumId) {
        window.location.href = `/forums/comments/view/${forumId}`;
      }
    });
  });

  upvoteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const forumId = button.dataset.id;
      if (!loggedInUserId) return alert("Please log in to vote.");

      try {
        const response = await fetch(`/forums/upvote/${forumId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: loggedInUserId }),
        });
        if (response.ok || response.status === 400) {
          window.location.reload();
        } else {
          const { error } = await response.json();
          alert(error);
        }
      } catch (err) {
        console.error("Error while upvoting:", err);
      }
    });
  });

  downvoteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const forumId = button.dataset.id;
      if (!loggedInUserId) return alert("Please log in to vote.");

      try {
        const response = await fetch(`/forums/downvote/${forumId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: loggedInUserId }),
        });
        if (response.ok || response.status === 400) {
          window.location.reload();
        } else {
          const { error } = await response.json();
          alert(error);
        }
      } catch (err) {
        console.error("Error while downvoting:", err);
      }
    });
  });

  document.querySelectorAll(".comment-delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const commentId = btn.dataset.id;
      if (!commentId) return;

      if (!confirm("Are you sure you want to delete this comment?")) {
        return;
      }

      try {
        const res = await fetch(`/forums/comments/${commentId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (res.ok && data.success) {
          btn.closest(".comment-card")?.remove();
        } else {
          console.error(data.message || "Delete failed");
        }
      } catch (err) {
        console.error("Error deleting comment:", err);
      }
    });
  });

  const reportModal = document.getElementById("reportModal");
  const reportForm = document.getElementById("reportForm");
  const reportContentIdInput = document.getElementById("reportContentId");
  const reportCancelBtn = document.getElementById("reportCancel");
  const reportReason = document.getElementById("reportReason");
  const reportError = document.getElementById("reportError");

  document.querySelectorAll(".report-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      reportForm.action = `/report/${btn.dataset.type}`;
      reportContentIdInput.value = btn.dataset.id;
      reportReason.value = "";
      reportError.textContent = "";
      reportModal.style.display = "flex";
    });
  });

  reportCancelBtn.addEventListener("click", () => {
    reportModal.style.display = "none";
    reportForm.reset();
    reportError.textContent = "";
  });

  reportModal.addEventListener("click", (e) => {
    if (e.target === reportModal) {
      reportModal.style.display = "none";
      reportForm.reset();
      reportError.textContent = "";
    }
  });

  reportForm.addEventListener("submit", (e) => {
    const text = reportReason.value.trim();
    if (text.length < 10) {
      e.preventDefault();
      reportError.textContent = "Please provide atleast 10 characters";
      reportReason.value = "";
      reportReason.focus();
    }
  });
});
