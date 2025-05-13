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
  const sampleMissingRequests = [

    {
      userId: users[1]._id,
      itemType: "Department",
      itemName: "Computer Science",
      description: "The Computer Science department is not listed.",
    },
  
  ];
 
  await MissingRequestModel.insertMany(sampleMissingRequests);
  console.log(`Inserted ${sampleMissingRequests.length} missing requests`);
  console.log("Seeded missing requests successfully");
}