import mongoose from "mongoose";
import dotenv from "dotenv";

import seedUsers from "./users.js";
import seedAdminTags from "./adminTags.js";
import seedCategoryForAcademicResource from "./CategoryForAcademicResource.js";
import seedAcademicResources from "./academicResources.js";

import seedTags from "./tags.js";
import seedDepartments from "./departments.js";
import seedCourses from "./courses.js";

import seedPolls from "./polls.js";
import seedForums from "./forums.js";
import seedComments from "./forumComments.js";

import seedCampusResources from "./campusResources.js";
import seedAnnouncements from "./announcements.js";
import seedMissingRequests from "./missingRequests.js";


// Load env variables
dotenv.config();

async function main() {
  try {
    // 1. Connect to DB
    await mongoose.connect(process.env.MONGODB_URI + "/duck_Hub", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    //empty the database
    await mongoose.connection.db.dropDatabase();
    console.log("🔗 Connected to DuckHub database");
    console.log("🚀 Starting seed process");

    // 2. Seed core data
    await seedUsers();

    // 3. Seed academic resources
    await seedAdminTags();
    await seedCategoryForAcademicResource();
    await seedAcademicResources();

    // 4. Seed general tags
    await seedTags();

    // 5. Seed courses & reviews
    await seedDepartments();
    await seedCourses();


    // 6. Seed polls & forums
    await seedPolls();
    await seedForums();

    // 7. Seed comments & votes
    await seedComments();

    // 8. Seed campus resources & announcements
    await seedCampusResources();
    await seedAnnouncements();

    // 9. Seed missing requests
    await seedMissingRequests();

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
