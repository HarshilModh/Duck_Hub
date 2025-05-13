import Poll from "../models/polls.model.js";
import User from "../models/user.model.js";
import Tags from "../models/tags.model.js";

export default async function seedPolls() {
  await Poll.deleteMany({});
  console.log("Cleared polls collection");

  const users = await User.find().limit(2);
  const tags = await Tags.find().limit(2);

  if (users.length < 1 || tags.length < 1) {
    console.warn("Need users & tags—run seedUsers & seedTags first!");
    return;
  }
  const samplePolls = [
    {
      question: "What is your favorite programming language?",
      options: [
        { answer: "JavaScript" },
        { answer: "Python" },
        { answer: "Java" },
        { answer: "C++" },
      ],
      createdBy: users[0]._id,
      tags: [tags[0]._id, tags[1]._id],
    },
    {
      question: "What is your favorite front-end framework?",
      options: [
        { answer: "React" },
        { answer: "Vue" },
        { answer: "Angular" },
        { answer: "Svelte" },
      ],
      createdBy: users[1]._id,
      tags: [tags[0]._id, tags[1]._id],
    },
  ];
  await Poll.insertMany(samplePolls);
  console.log(`Inserted ${samplePolls.length} polls`);
  const polls = await Poll.find()
    .populate("createdBy", "name email")
    .populate("tags", "name createdBy");
  console.log("Populated polls with users and tags", polls);
  console.log("Polls seeded successfully");
  return polls;
}