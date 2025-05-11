/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from "express";
import { Student, VaccinationRecord } from "../models";
import multer from "multer";
import { parse } from "papaparse";

const router = express.Router();

// --- Multer Configuration for File Uploads ---
const storage = multer.memoryStorage(); // Store the file in memory (you can also save to disk)
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});

// --- Helper Functions ---
const validateStudentData = (
  data: any,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name) errors.push("Name is required");
  if (!data.class) errors.push("Class is required");
  if (!data.studentId) errors.push("Student ID is required");

  // Validate date format if provided
  if (data.dateOfBirth && isNaN(Date.parse(data.dateOfBirth))) {
    errors.push("Invalid date format for Date of Birth");
  }

  return { isValid: errors.length === 0, errors };
};

// Create a new student
router.post("/", async (req: Request, res: Response) => {
  try {
    const newStudent = new Student(req.body);
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get all students
router.get("/", async (req: Request, res: Response) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get total number of students
router.get("/count", async (req: Request, res: Response) => {
  try {
    const studentCount = await Student.countDocuments();
    res.json({ count: studentCount });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get number and percentage of students vaccinated
router.get("/vaccinated-stats", async (req: Request, res: Response) => {
  try {
    const totalStudents = await Student.countDocuments();
    const vaccinatedStudents = await VaccinationRecord.countDocuments({
      vaccinated: true,
    });
    const vaccinationPercentage =
      totalStudents > 0 ? (vaccinatedStudents / totalStudents) * 100 : 0;

    res.json({
      total: totalStudents,
      vaccinated: vaccinatedStudents,
      percentage: vaccinationPercentage.toFixed(2), // Round to 2 decimal places
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// --- CSV Upload Route ---
router.post(
  "/upload-csv",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
      }

      const csvFile = req.file!.buffer.toString("utf8");

      // Parse CSV
      const parseResult = parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        transformHeader: (header) =>
          header.trim().toLowerCase().replace(/\s+/g, ""),
      });

      if (parseResult.errors.length > 0) {
        res.status(500).json({
          success: false,
          message: "Error parsing CSV file",
          errors: parseResult.errors,
        });
      }

      // Process student data
      const studentsToAdd: any[] = [];

      parseResult.data.forEach((row: any) => {
        // Process date if exists
        if (row.dateofbirth) {
          row.dateOfBirth = new Date(row.dateofbirth);
          delete row.dateofbirth;
        }

        const studentData = {
          name: row.name,
          class: row.class,
          studentId: row.studentid || row.student_id || row.studentId,
          guardian: row.guardian,
          dateOfBirth: row.dateOfBirth,
          gender: row.gender,
          contactNumber:
            row.contactnumber || row.contact_number || row.contactNumber,
          address: row.address,
        };

        // Validate student data
        const validation = validateStudentData(studentData);

        if (validation.isValid) {
          studentsToAdd.push(studentData);
        } else {
          res.status(500).json({
            success: false,
            message: "Error parsing CSV file",
            errors: parseResult.errors,
          });
        }
      });

      // Insert students into database
      const results = await Promise.allSettled(
        studentsToAdd.map((student) => {
          return Student.findOneAndUpdate(
            { studentId: student.studentId },
            student,
            { upsert: true, new: true, runValidators: true },
          );
        }),
      );

      // Check for any database errors
      const successful = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected");

      res.status(200).json({
        success: true,
        message: `Processed ${studentsToAdd.length} students. Added/Updated: ${successful}, Failed: ${failed.length}`,
        failedEntries: failed.map(
          (f) => (f as PromiseRejectedResult).reason.message,
        ),
      });
    } catch (error: any) {
      console.error("Error uploading students:", error);
      res.status(500).json({
        success: false,
        message: "Server error while processing CSV",
        error: (error as Error).message,
      });
    }
  },
);

// Get a single student by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update a student by ID
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedStudent) {
      res.status(404).json({ message: "Student not found" });
    }
    res.json(updatedStudent);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a student by ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      res.status(404).json({ message: "Student not found" });
    }
    res.status(204).send(); // No content for successful deletion
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

