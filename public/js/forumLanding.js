const upvoteButtons = document.querySelectorAll(".upvote-button");
const downvoteButtons = document.querySelectorAll(".downvote-button");
const commentButtons = document.querySelectorAll(".comment-button");

commentButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const forumId = e.currentTarget.dataset.id;
    if (forumId) {
      window.location.href = `/forums/comments/view/${forumId}`;
    }
  });
});

upvoteButtons.forEach((button) => {
  button.addEventListener("click", async (e) => {
    const forumId = e.currentTarget.dataset.id;
    if (!loggedInUserId) return alert("Please log in to vote.");

    try {
      const response = await fetch(`/forums/upvote/${forumId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: loggedInUserId }),
      });

      if (response.ok || response.status === 400) {
        // API set the session.toast for us – now reload to show it
        window.location.reload();
      } else {
        // show the error toast immediately if you like
        const { error } = await response.json();
        alert(error);
      }
    } catch (err) {
      console.error("Error while upvoting:", err);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
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
          // remove from DOM
          btn.closest(".comment-card").remove();
        } else {
          console.error(data.message || "Delete failed");
        }
      } catch (err) {
        console.error(err);
      }
    });
  });
});

downvoteButtons.forEach((button) => {
  button.addEventListener("click", async (e) => {
    const forumId = button.dataset.id;
    if (!loggedInUserId) {
      return alert("Please log in to vote.");
    }

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
