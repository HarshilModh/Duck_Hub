import CampusResource from "../models/campusResources.model.js";

export default async function seedCampusResources() {
  await CampusResource.deleteMany({});
  console.log("Cleared campus resources collection");
  const sampleResources = [
    //gym
    {
      resourceName: "Campus Gym",
      resourceType: "gym",
      location: {
        type: "Point",
        coordinates: [ -74.0060,40.7128], // Example coordinates
      },
      description: "A well-equipped gym for students.",
      contactDetails: {
        email: "gym@stevens.edu"
      },
      // Mon: 9:00 - 17:00,Tue: 10:00 - 18:00
      operatingHours: [
        "Mon: 9:00 - 17:00",
        "Tue: 10:00 - 18:00",
        "Wed: 9:00 - 17:00",
        "Thu: 10:00 - 18:00",
        "Fri: 9:00 - 17:00",
      ]
    },
    // Dorms
    {
      resourceName: "Campus Dorms",
      resourceType: "Dorms",
      location: {
        type: "Point",
        coordinates: [ -74.026521,40.744612,], // Example coordinates
      },
      description: "Student dormitories with all amenities.",
      contactDetails: {
        email: "dorm@stevens.edu"
      },
      // Mon: 9:00 - 17:00,Tue: 10:00 - 18:00
      operatingHours: [
        "Mon: 9:00 - 17:00",
        "Tue: 10:00 - 18:00",
        "Wed: 9:00 - 17:00",
        "Thu: 10:00 - 18:00",
        "Fri: 9:00 - 17:00",
      ]
    }]
  await CampusResource.insertMany(sampleResources);
  console.log(`Inserted ${sampleResources.length} campus resources`);
  const resources = await CampusResource.find()
   
  return resources;
}