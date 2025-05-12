import MissingRequestModel from "../models/MissingRequest.model.js";
import User from "../models/user.model.js";

export default async function seedMissingRequests() {
  await MissingRequestModel.deleteMany({});
  console.log("Cleared missing requests collection");

  const users = await User.find().limit(2);
  if (users.length < 1) {
    console.warn("Need users—run seedUsers first!");
    return;
  }

  const sampleRequests = [
    {
      userId: users[0]._id,
      itemType: "Course",
      itemName: "Advanced Quantum Computing",
      description: "Would love to see a course on quantum algorithms added.",
      status: "Pending",
    },
    {
      userId: users[1]._id,
      itemType: "Other",
      itemName: "Campus Shuttle Tracker App",
      description:
        "A real-time shuttle tracker for getting around campus would be helpful.",
      status: "Pending",
    },
  ];

  await MissingRequestModel.insertMany(sampleRequests);
  console.log(`Inserted ${sampleRequests.length} missing requests`);
}
