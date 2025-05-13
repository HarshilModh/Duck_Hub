import mongoose from "mongoose";
import dotenv from "dotenv";

import seedUsers from "./users.js";
import seedAdminTags from "./adminTags.js";
// import seedAcademicResources from "./academicResources.js";
import seedAcademicResourceVotes from "./resourceVotes.js";
import seedTags from "./tags.js";
import seedDepartments from "./departments.js";
import seedCourses from "./courses.js";
import seedReviews from "./reviews.js";
import seedPolls from "./polls.js";
import seedForums from "./forums.js";
import seedComments from "./forumComments.js";
import seedForumVotes from "./forumVotes.js";
import seedCommentVotes from "./forumCommentVotes.js";
import seedReviewVotes from "./reviewVotes.js";
import seedCampusResources from "./campusResources.js";
import seedAnnouncements from "./announcements.js";
import seedMissingRequests from "./missingRequests.js";
import seedReports from "./reports.js";

// Load env variables
dotenv.config();

async function main() {
  try {
    // 1. Connect to DB
    await mongoose.connect(process.env.MONGODB_URI + "/duck_Hub", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🔗 Connected to DuckHub database");
    console.log("🚀 Starting seed process");

    // 2. Seed core data
    await seedUsers();

    // 3. Seed academic resources
    await seedAdminTags();
    // await seedAcademicResources();
    await seedAcademicResourceVotes();

    // 4. Seed general tags
    await seedTags();

    // 5. Seed courses & reviews
    await seedDepartments();
    await seedCourses();
    await seedReviews();

    // 6. Seed polls & forums
    await seedPolls();
    await seedForums();

    // 7. Seed comments & votes
    await seedComments();
    await seedForumVotes();
    await seedCommentVotes();
    await seedReviewVotes();

    // 8. Seed campus resources & announcements
    await seedCampusResources();
    await seedAnnouncements();

    // 9. Seed missing requests
    await seedMissingRequests();

    // 10. Seed reports (depends on various collections)
    await seedReports();

    console.log("✅ Seed process completed");
  } catch (err) {
    console.error("❌ Seed process error:", err);
  } finally {
    // 11. Disconnect
    await mongoose.disconnect();
    console.log("🔌 Disconnected from the database");
  }
}

// Execute
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
