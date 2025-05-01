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
