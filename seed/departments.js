// seeds/departments.js
import Department from "../models/department.model.js";

export default async function seedDepartments() {
  // 1. Clear existing departments
  await Department.deleteMany({});
  console.log("Cleared departments collection");

  // 2. Define sample departments
  const sampleDepartments = [
    { departmentName: "computer science" },
    { departmentName: "electrical engineering" },
    { departmentName: "mechanical engineering" },
    { departmentName: "civil engineering" },
    { departmentName: "information technology" },
  ];

  // 3. Insert
  await Department.insertMany(sampleDepartments);
  console.log(`🌱 Inserted ${sampleDepartments.length} departments`);
}
