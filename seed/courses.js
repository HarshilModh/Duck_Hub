import Course from "../models/courses.model.js";
import Department from "../models/department.model.js";

export default async function seedCourses() {
  await Course.deleteMany({});
  console.log("Cleared courses collection");

  const departments = await Department.find().limit(3);
  if (departments.length === 0) {
    console.warn("No departments found—run seedDepartments first!");
    return;
  }

  const sampleCourses = [
    {
      courseCode: "CS101",
      courseName: "introduction to programming",
      courseDescription: "Learn fundamentals of programming using JavaScript.",
      departmentId: departments[0]._id,
      difficultyRating: 1,
      averageRating: 4.5,
      reviews: [], // will be populated by seedReviews
    },
    {
      courseCode: "EE202",
      courseName: "circuit analysis",
      courseDescription: "Study of electrical circuits and network theorems.",
      departmentId: departments[1]._id,
      difficultyRating: 2,
      averageRating: 4.0,
      reviews: [],
    },
    {
      courseCode: "ME303",
      courseName: "thermodynamics",
      courseDescription:
        "Principles of energy, heat, and work in mechanical systems.",
      departmentId: departments[2]._id,
      difficultyRating: 3,
      averageRating: 3.8,
      reviews: [],
    },
  ];

  await Course.insertMany(sampleCourses);
  console.log(`Inserted ${sampleCourses.length} courses`);
}
