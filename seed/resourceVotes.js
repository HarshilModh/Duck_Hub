import AcademicResourceVotes from "../models/academicResourceVotes.model.js";
import AcademicResource from "../models/academicResources.model.js";
import User from "../models/user.model.js";

export default async function seedAcademicResourceVotes() {
  await AcademicResourceVotes.deleteMany({});
  console.log("Cleared academic resource votes collection");
  const resources = await AcademicResource.find().limit(2);
  const users = await User.find().limit(2);

  if (resources.length < 1 || users.length < 1) {
    console.warn(
      "Need resources & users—run seedAcademicResources & seedUsers first!"
    );
    return;
  }

  const sampleVotes = [
    {
      voterId: users[0]._id,
      academicResourceId: resources[0]._id,
      voteType: "UP",
    },
    {
      voterId: users[1]._id,
      academicResourceId: resources[1]._id,
      voteType: "DOWN",
    },
  ];

  await AcademicResourceVotes.insertMany(sampleVotes);
  console.log(`Inserted ${sampleVotes.length} academic resource votes`);
}
