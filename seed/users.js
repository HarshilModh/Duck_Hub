import User from "../models/user.model.js";

export default async function seedUsers() {
  await User.deleteMany({});
  console.log("🗑️  Cleared users collection");

  const users = [
    {
      firstName: "alice",
      lastName: "anderson",
      email: "alice@example.com",
      password: "Password123!",
      role: "admin",
      isVerified: true,
    },
    {
      firstName: "bob",
      lastName: "bennet",
      email: "bob@example.com",
      password: "Secret456!",
      role: "user",
      isVerified: true,
    },
    {
      firstName: "carol",
      lastName: "chen",
      email: "carol@example.com",
      password: "MyPass789!",
      role: "user",
    },
  ];
  await User.create(users);
  console.log(`Inserted ${users.length} users`);
}
