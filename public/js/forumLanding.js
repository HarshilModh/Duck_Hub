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

    if (!loggedInUserId) {
      console.log("User ID is mandatory");
      return;
    }

    try {
      console.log(forumId);
      const response = await fetch(
        `http://localhost:3000/forums/upvote/${forumId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedInUserId }),
        }
      );

      if (response.ok) {
        const updatedPost = await response.json();
        const countSpan = button.querySelector("span");
        if (countSpan) {
          countSpan.textContent = updatedPost.upVotes;
        }
        window.location.reload();
      } else {
        console.error("Failed to upvote:", response.status);
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
    const forumId = e.currentTarget.dataset.id;

    if (!loggedInUserId) {
      console.error("No logged-in user. Cannot downvote.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/forums/downvote/${forumId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedInUserId }),
        }
      );

      if (response.ok) {
        const updatedPost = await response.json();
        const countSpan = button.querySelector("span");
        if (countSpan) {
          countSpan.textContent = updatedPost.downVotes;
        }
        window.location.reload();
      } else {
        console.error("Failed to downvote:", response.status);
      }
    } catch (err) {
      console.error("Error while downvoting:", err);
    }
  });
});
