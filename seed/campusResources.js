import CampusResource from "../models/campusResources.model.js";

export default async function seedCampusResources() {
  await CampusResource.deleteMany({});
  console.log("Cleared campus resources collection");

  const sampleResources = [
    {
      resourceName: "Dana Library",
      resourceType: "library",
      location: {
        type: "Point",
        coordinates: [-74.0113, 40.743],
      },
      description:
        "Main campus library with quiet study areas and group rooms.",
      contactDetails: {
        email: "library@stevens.edu",
        contactNumber: "+1-201-216-5000",
      },
      operatingHours: [
        "Mon–Thu: 8am–10pm",
        "Fri: 8am–8pm",
        "Sat: 10am–6pm",
        "Sun: 12pm–8pm",
      ],
      status: "active",
    },
    {
      resourceName: "Carnival Dining Hall",
      resourceType: "Dining Hall",
      location: {
        type: "Point",
        coordinates: [-74.0125, 40.7435],
      },
      description:
        "All-you-can-eat dining hall serving breakfast, lunch, and dinner.",
      contactDetails: {
        email: "dining@stevens.edu",
        contactNumber: "+1-201-216-5001",
      },
      operatingHours: ["Mon–Fri: 7am–9pm", "Sat–Sun: 8am–8pm"],
      status: "active",
    },
    {
      resourceName: "Burchard Hall Computer Lab",
      resourceType: "Computer Lab",
      location: {
        type: "Point",
        coordinates: [-74.0117, 40.7425],
      },
      description:
        "24/7 computer lab equipped with Windows and Linux workstations.",
      contactDetails: {
        email: "itlab@stevens.edu",
        contactNumber: "+1-201-216-5002",
      },
      operatingHours: ["Mon–Fri: 7am–9pm", "Sat–Sun: 8am–8pm"],
      status: "active",
    },
  ];

  await CampusResource.insertMany(sampleResources);
  console.log(`Inserted ${sampleResources.length} campus resources`);
}
