import Announcement from "../models/adminAnnouncements.model.js";

export default async function seedAnnouncements() {
  await Announcement.deleteMany({});
  console.log("Cleared announcements collection");

  const sampleAnnouncements = [
    {
      title: "WELCOME TO DUCK_HUB",
      content:
        "Duck_Hub is now live! Start sharing and collaborating on your favorite topics.",
    },
    {
      title: "MAINTENANCE WINDOW",
      content:
        "The platform will be down for maintenance on Saturday from 2am to 4am EST.",
    },
    {
      title: "NEW FEATURE: POLLS",
      content:
        "You can now create and vote in polls—give it a try on your next post!",
    },
  ];

  await Announcement.insertMany(sampleAnnouncements);
  console.log(`Inserted ${sampleAnnouncements.length} announcements`);
}
