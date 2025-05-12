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
      question: "Which backend framework do you prefer?",
      options: [
        { answer: "Express.js", votes: 1, voterId: [users[0]._id] },
        { answer: "Koa", votes: 1, voterId: [users[1]._id] },
        { answer: "NestJS", votes: 0, voterId: [] },
      ],
      createdBy: users[0]._id,
      imageURLs: [],
      status: "active",
      tags: [tags[0]._id],
      reportedBy: [],
    },
    {
      question: "Your favorite NoSQL database?",
      options: [
        { answer: "MongoDB", votes: 2, voterId: [users[0]._id, users[1]._id] },
        { answer: "Cassandra", votes: 0, voterId: [] },
      ],
      createdBy: users[1]._id,
      imageURLs: [],
      status: "active",
      tags: [tags[1]._id],
      reportedBy: [],
    },
  ];

  await Poll.insertMany(samplePolls);
  console.log(`Inserted ${samplePolls.length} polls`);
}
