document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".comment-delete");
  if (!deleteButtons.length) return;

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const commentId = btn.dataset.id;
      if (!loggedInUserId) {
        return alert("Please log in to delete comments.");
      }
      if (!commentId) return;

      if (!confirm("Are you sure you want to delete this comment?")) {
        return;
      }

      try {
        const res = await fetch(`/forums/comments/${commentId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: window.loggedInUserId }),
        });
        const data = await res.json();

        if (res.ok && data.success) {
          btn.closest(".comment-card")?.remove();
        } else {
          alert(data.error || data.message || "Failed to delete comment.");
        }
      } catch (err) {
        console.error("Error deleting comment:", err);
        alert("An error occurred. Please try again.");
      }
    });
  });
});
