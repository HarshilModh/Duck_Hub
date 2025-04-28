// Upvote and Downvote button logic
const upvoteButtons = document.querySelectorAll(".upvote-button");
const downvoteButtons = document.querySelectorAll(".downvote-button");

// Handle upvote clicks
upvoteButtons.forEach((button) => {
  button.addEventListener("click", async (e) => {
    const forumId = e.target.getAttribute("data-id");

    if (!loggedInUserId) {
      console.log("User ID is mandatory");
      return;
    }

    try {
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
        console.log("Upvote successful:", updatedPost);
        // Optionally update UI here
      } else {
        console.error("Failed to upvote:", response.status);
      }
    } catch (err) {
      console.error("Error while upvoting:", err);
    }
  });
});

// Handle downvote clicks
downvoteButtons.forEach((button) => {
  button.addEventListener("click", async (e) => {
    const forumId = e.target.getAttribute("data-id");

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
        console.log("Downvote successful:", updatedPost);
        // Optionally update UI here
      } else {
        console.error("Failed to downvote:", response.status);
      }
    } catch (err) {
      console.error("Error while downvoting:", err);
    }
  });
});
