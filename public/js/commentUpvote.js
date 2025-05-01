const upvoteButtons = document.querySelectorAll(".comment-upvote");
const downvoteButtons = document.querySelectorAll(".comment-downvote");

upvoteButtons.forEach((button) => {
  button.addEventListener("click", async (e) => {
    const commentId = e.currentTarget.dataset.id;

    if (!loggedInUserId) {
      console.log("User ID is mandatory");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/forums/comments/upvote/${commentId}`,
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

downvoteButtons.forEach((button) => {
  button.addEventListener("click", async (e) => {
    const commentId = e.currentTarget.dataset.id;

    if (!loggedInUserId) {
      console.log("User ID is mandatory");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/forums/comments/downvote/${commentId}`,
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
        console.error("Failed to downVote:", response.status);
      }
    } catch (err) {
      console.error("Error while downVoting:", err);
    }
  });
});
