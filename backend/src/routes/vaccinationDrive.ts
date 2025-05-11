/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from "express";
import { VaccinationDrive, IVaccinationDrive } from "../models";
import { body } from "express-validator"; // For validation

const router = express.Router();

const validateVaccinationDrive = [
  body("date")
    .isISO8601()
    .toDate()
    .withMessage("Date must be a valid ISO 8601 date")
    .custom(async (value) => {
      // 1. Ensure date is at least 15 days in advance
      const driveDate = new Date(value);
      const today = new Date();
      const minDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 15,
      ); // Today + 15 days

      if (driveDate < minDate) {
        throw new Error(
          "Vaccination drive must be scheduled at least 15 days in advance",
        );
      }
    }),
  body("availableDoses")
    .isInt({ min: 1 })
    .withMessage("Available doses must be a positive integer"),
  body("applicableClasses")
    .isArray()
    .withMessage("Applicable classes must be an array"),
];

// Create a new vaccination drive
router.post(
  "/",
  validateVaccinationDrive,
  async (req: Request<any, any, IVaccinationDrive>, res: Response) => {
    try {
      const newDrive = new VaccinationDrive(req.body);
      const savedDrive = await newDrive.save();
      res.status(201).json(savedDrive);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
);

// Get all vaccination drives
router.get("/", async (req: Request, res: Response) => {
  try {
    const drives = await VaccinationDrive.find();
    res.json(drives);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get upcoming vaccination drives (within the next 30 days)
router.get("/upcoming", async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const thirtyDaysLater = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 30,
    );

    const upcomingDrives = await VaccinationDrive.find({
      date: { $gte: today, $lte: thirtyDaysLater },
    }).sort({ date: 1 }); // Sort by date in ascending order

    res.json(upcomingDrives);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single vaccination drive by ID
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const drive = await VaccinationDrive.findById(req.params.id);
    if (!drive) {
      res.status(404).json({ message: "Vaccination drive not found" });
    }
    res.json(drive);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update a vaccination drive by ID
router.put(
  "/:id",
  validateVaccinationDrive,
  async (
    req: Request<{ id: string }, any, IVaccinationDrive>,
    res: Response,
  ) => {
    try {
      const updatedDrive = await VaccinationDrive.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      if (!updatedDrive) {
        res.status(404).json({ message: "Vaccination drive not found" });
      }
      res.json(updatedDrive);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
);

// Delete a vaccination drive by ID
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const deletedDrive = await VaccinationDrive.findByIdAndDelete(
      req.params.id,
    );
    if (!deletedDrive) {
      res.status(404).json({ message: "Vaccination drive not found" });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
