import { Student } from "../models/Student";
import { VaccinationDrive } from "../models/VaccinationDrive";
import { VaccinationRecord } from "../models/VaccinationRecord";
import mongoose from "mongoose";
import dontenv from "dotenv";

dontenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

const students = [
  {
    name: "John Smith",
    class: "10A",
    studentId: "S10001",
    guardian: "Mary Smith",
    dateOfBirth: new Date("2010-05-15"),
    gender: "Male",
    contactNumber: "555-123-4567",
    address: "123 Main St, Springfield",
  },
  {
    name: "Emma Johnson",
    class: "10A",
    studentId: "S10002",
    guardian: "Robert Johnson",
    dateOfBirth: new Date("2010-08-21"),
    gender: "Female",
    contactNumber: "555-234-5678",
    address: "456 Oak Ave, Springfield",
  },
  {
    name: "Michael Williams",
    class: "9B",
    studentId: "S10003",
    guardian: "Sarah Williams",
    dateOfBirth: new Date("2011-03-10"),
    gender: "Male",
    contactNumber: "555-345-6789",
    address: "789 Pine Rd, Springfield",
  },
  {
    name: "Sophia Brown",
    class: "9B",
    studentId: "S10004",
    guardian: "David Brown",
    dateOfBirth: new Date("2011-11-05"),
    gender: "Female",
    contactNumber: "555-456-7890",
    address: "101 Elm St, Springfield",
  },
  {
    name: "Daniel Martinez",
    class: "8C",
    studentId: "S10005",
    guardian: "Maria Martinez",
    dateOfBirth: new Date("2012-07-17"),
    gender: "Male",
    contactNumber: "555-567-8901",
    address: "202 Cedar Ln, Springfield",
  },
  {
    name: "Olivia Garcia",
    class: "8C",
    studentId: "S10006",
    guardian: "Jose Garcia",
    dateOfBirth: new Date("2012-09-30"),
    gender: "Female",
    contactNumber: "555-678-9012",
    address: "303 Maple Dr, Springfield",
  },
  {
    name: "Alexander Rodriguez",
    class: "7D",
    studentId: "S10007",
    guardian: "Elena Rodriguez",
    dateOfBirth: new Date("2013-01-25"),
    gender: "Male",
    contactNumber: "555-789-0123",
    address: "404 Birch Blvd, Springfield",
  },
  {
    name: "Isabella Lopez",
    class: "7D",
    studentId: "S10008",
    guardian: "Carlos Lopez",
    dateOfBirth: new Date("2013-04-12"),
    gender: "Female",
    contactNumber: "555-890-1234",
    address: "505 Aspen Way, Springfield",
  },
  {
    name: "William Lee",
    class: "11E",
    studentId: "S10009",
    guardian: "Jennifer Lee",
    dateOfBirth: new Date("2009-12-08"),
    gender: "Male",
    contactNumber: "555-901-2345",
    address: "606 Walnut St, Springfield",
  },
  {
    name: "Ava Wilson",
    class: "11E",
    studentId: "S10010",
    guardian: "Thomas Wilson",
    dateOfBirth: new Date("2009-06-19"),
    gender: "Female",
    contactNumber: "555-012-3456",
    address: "707 Cherry Ave, Springfield",
  },
];

const vaccinationDrives = [
  {
    vaccineName: "Influenza Vaccine",
    date: new Date("2025-05-15"),
    availableDoses: 200,
    applicableClasses: ["7D", "8C", "9B", "10A", "11E"],
    venue: "School Gymnasium",
    organizer: "Springfield Health Department",
    notes: "Annual flu vaccination drive",
  },
  {
    vaccineName: "MMR Booster",
    date: new Date("2025-06-10"),
    availableDoses: 150,
    applicableClasses: ["9B", "10A"],
    venue: "School Health Center",
    organizer: "County Medical Association",
    notes: "Measles, Mumps, and Rubella booster shots",
  },
  {
    vaccineName: "Tdap Vaccine",
    date: new Date("2025-07-05"),
    availableDoses: 100,
    applicableClasses: ["7D", "8C"],
    venue: "School Health Center",
    organizer: "Springfield Public Health",
    notes: "Tetanus, Diphtheria, and Pertussis vaccination",
  },
  {
    vaccineName: "Meningococcal Vaccine",
    date: new Date("2025-08-20"),
    availableDoses: 120,
    applicableClasses: ["10A", "11E"],
    venue: "School Auditorium",
    organizer: "State Health Services",
    notes: "Protection against meningitis for older students",
  },
];

// 4.  Updated seedDB() Function

export default async function seedDB() {
  try {
    await mongoose
      .connect(MONGODB_URI, {
        serverApi: {
          version: "1",
          strict: true,
          deprecationErrors: false,
        },
      })
      .then(() => console.log("Mongo Connected"))
      .catch((err) => console.error("Mongo Connection Failed: ", err));

    console.log("Connected to MongoDB");

    await Promise.all([
      Student.deleteMany({}),
      VaccinationDrive.deleteMany({}),
      VaccinationRecord.deleteMany({}),
    ]);

    console.log("Cleared existing data");

    const savedStudents = await Student.insertMany(students);
    console.log(`Inserted ${savedStudents.length} students`);

    const savedVaccinationDrives =
      await VaccinationDrive.insertMany(vaccinationDrives);
    console.log(`Inserted ${savedVaccinationDrives.length} vaccination drives`);

    const vaccinationRecords = [];

    // First drive (Influenza) - Everyone gets it
    for (const student of savedStudents) {
      vaccinationRecords.push({
        studentId: student._id,
        vaccinationDriveId: savedVaccinationDrives[0]._id,
        vaccinated: true,
        vaccinationDate: new Date("2025-05-15"),
        administeredBy: "Nurse Johnson",
        batchNumber: "FLU2025-A",
        notes: "No adverse reactions",
      });
    }

    // Second drive (MMR) - Only for applicable classes
    for (const student of savedStudents) {
      if (["9B", "10A"].includes(student.class)) {
        vaccinationRecords.push({
          studentId: student._id,
          vaccinationDriveId: savedVaccinationDrives[1]._id,
          vaccinated: Math.random() > 0.2, // 80% vaccination rate
          vaccinationDate: Math.random() > 0.2 ? new Date("2025-06-10") : null,
          administeredBy: Math.random() > 0.2 ? "Dr. Williams" : null,
          batchNumber: Math.random() > 0.2 ? "MMR2025-B" : null,
          notes:
            Math.random() > 0.2
              ? "Completed successfully"
              : "Absent on vaccination day",
        });
      }
    }

    // Third drive (Tdap) - Only for applicable classes
    for (const student of savedStudents) {
      if (["7D", "8C"].includes(student.class)) {
        vaccinationRecords.push({
          studentId: student._id,
          vaccinationDriveId: savedVaccinationDrives[2]._id,
          vaccinated: Math.random() > 0.3, // 70% vaccination rate
          vaccinationDate: Math.random() > 0.3 ? new Date("2025-07-05") : null,
          administeredBy: Math.random() > 0.3 ? "Nurse Davis" : null,
          batchNumber: Math.random() > 0.3 ? "TDAP2025-C" : null,
          notes:
            Math.random() > 0.3
              ? "Completed successfully"
              : "Parent declined vaccination",
        });
      }
    }

    // Fourth drive (Meningococcal) - scheduled for future, no vaccinations yet
    for (const student of savedStudents) {
      if (["10A", "11E"].includes(student.class)) {
        vaccinationRecords.push({
          studentId: student._id,
          vaccinationDriveId: savedVaccinationDrives[3]._id,
          vaccinated: false,
          vaccinationDate: null,
          administeredBy: null,
          batchNumber: null,
          notes: "Scheduled for future date",
        });
      }
    }

    const savedVaccinationRecords =
      await VaccinationRecord.insertMany(vaccinationRecords);
    console.log(
      `Inserted ${savedVaccinationRecords.length} vaccination records`,
    );

    console.log("Database seeded!");

    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
