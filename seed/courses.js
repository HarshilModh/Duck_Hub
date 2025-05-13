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
      courseName: "Introduction to Computer Science",
      courseDescription:
        "An introduction to the fundamental concepts of computer science.",
      departmentId: departments[0]._id,
    },
    {
      courseCode: "CS102",
      courseName: "Data Structures and Algorithms",
      courseDescription:
        "A study of data structures and algorithms for efficient data processing.",
      departmentId: departments[1]._id,
    },
    {
      courseCode: "CS103",
      courseName: "Web Development",
      courseDescription:
        "Learn how to build dynamic websites using HTML, CSS, and JavaScript.",
      departmentId: departments[2]._id,
    },
  ];
  await Course.insertMany(sampleCourses);
  console.log(`Inserted ${sampleCourses.length} courses`);
  const courses = await Course.find();
  console.log("Courses seeded successfully:", courses);
  return courses;
}