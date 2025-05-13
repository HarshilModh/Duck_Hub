// seeds/departments.js
import Department from "../models/department.model.js";
export default async function seedDepartments() {
  // 1. Clear existing departments
  await Department.deleteMany({});
  console.log("Cleared departments collection");
  // 2. Define sample departments
  const sampleDepartments = [

    {
      departmentName: "department of computer science",
    },
    {
      departmentName: "department of chemical engineering and materials science",
    },
    {
      departmentName: "department of chemistry and chemical biology",
    },
    {
      departmentName: "department of civil, environmental and ocean engineering",
    },
    {
       departmentName: "department of biomedical engineering",
    },
    {
      departmentName: "department of electrical and computer engineering",
    },
    {
      departmentName: "department of mathematical sciences",
    },
    {
      departmentName: "department of mechanical engineering",
    },
    {
      departmentName: "department of physics",
    },
    {
      departmentName: "department of systems and enterprises",
    },
 
  ];
  // 3. Insert sample departments into the database
  const insertedDepartments = await Department.insertMany(
    sampleDepartments
  );
  console.log(`Inserted ${insertedDepartments.length} departments`);
  // 4. Log the inserted departments
  console.log("Inserted departments:", insertedDepartments);
  // 5. Return the inserted departments
  return insertedDepartments;
}
