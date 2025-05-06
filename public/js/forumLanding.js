document.addEventListener("DOMContentLoaded", () => {
  // Voting and comment navigation
  const upvoteButtons = document.querySelectorAll(".upvote-button");
  const downvoteButtons = document.querySelectorAll(".downvote-button");
  const commentButtons = document.querySelectorAll(".comment-button");
  // const pollOptions = document.querySelectorAll(".option-vote-form");

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
    button.addEventListener("click", async (e) => {
      const forumId = e.currentTarget.dataset.id;
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

  // Comment deletion handlers
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
          btn.closest(".comment-card").remove();
        } else {
          console.error(data.message || "Delete failed");
        }
      } catch (err) {
        console.error(err);
      }
    });
  });

  // ------------------------ Report Modal Logic ------------------------
  const reportModal = document.getElementById("reportModal");
  const reportForm = document.getElementById("reportForm");
  const reportContentIdInput = document.getElementById("reportContentId");
  const reportCancelBtn = document.getElementById("reportCancel");

  document.querySelectorAll(".report-button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const contentId = e.currentTarget.dataset.id;
      reportContentIdInput.value = contentId;
      reportModal.style.display = "flex"; // show modal overlay
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
  //   pollOptions.forEach((btn) => {
  //     btn.addEventListener("click", async () => {
  //       const pollId = btn.dataset.pollId;
  //       const optionId = btn.dataset.optionId;

  //       if (!loggedInUserId) {
  //         return alert("Please log in to vote.");
  //       }

  //       try {
  //         const res = await fetch(`/polls/${pollId}/vote`, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ optionId, userId: loggedInUserId }),
  //         });
  //         if (res.ok) window.location.reload();
  //         else {
  //           const err = await res.json();
  //           alert("Error: " + (err.error || err.message || res.statusText));
  //         }
  //       } catch (e) {
  //         console.error(e);
  //         alert("Something went wrong. Please try again.");
  //       }
  //     });
  //   });
});
