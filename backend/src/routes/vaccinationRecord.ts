/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from "express";
import { VaccinationRecord, IVaccinationRecord, Student } from "../models";

const router = express.Router();

// Create a new vaccination record
router.post(
  "/",
  async (
    req: Request<any, any, Omit<IVaccinationRecord, "_id">>,
    res: Response,
  ) => {
    try {
      const newRecord = new VaccinationRecord(req.body);
      const savedRecord = await newRecord.save();
      res.status(201).json(savedRecord);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
);

// Get all vaccination records
router.get("/", async (req: Request, res: Response) => {
  try {
    const records = await VaccinationRecord.find()
      .populate("studentId")
      .populate("vaccinationDriveId");
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get Vaccination Stats
router.get("/stats", async (req: Request, res: Response) => {
  try {
    const totalStudents = await Student.countDocuments();

    const vaccinatedStudents = await Student.countDocuments({
      _id: {
        $in: await VaccinationRecord.distinct("studentId", {
          vaccinated: true,
        }),
      },
    });

    // Calculate percentage
    const vaccinationPercentage =
      totalStudents > 0 ? (vaccinatedStudents / totalStudents) * 100 : 0;

    res.json({
      totalStudents: totalStudents,
      vaccinatedStudents: vaccinatedStudents,
      vaccinationPercentage: vaccinationPercentage,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single vaccination record by ID
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const record = await VaccinationRecord.findById(req.params.id)
      .populate("studentId")
      .populate("vaccinationDriveId");
    if (!record) {
      res.status(404).json({ message: "Vaccination record not found" });
    }
    res.json(record);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update a vaccination record by ID
router.put(
  "/:id",
  async (
    req: Request<{ id: string }, any, Omit<IVaccinationRecord, "_id">>,
    res: Response,
  ) => {
    try {
      const updatedRecord = await VaccinationRecord.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      if (!updatedRecord) {
        res.status(404).json({ message: "Vaccination record not found" });
      }
      res.json(updatedRecord);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
);

// Delete a vaccination record by ID
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const deletedRecord = await VaccinationRecord.findByIdAndDelete(
      req.params.id,
    );
    if (!deletedRecord) {
      res.status(404).json({ message: "Vaccination record not found" });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

