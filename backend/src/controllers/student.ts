import { Request, Response } from "express";
import { Student } from "../models/Student";
import { IVaccinationRecord } from "../models/VaccinationRecord";

// CREATE Student
export const createStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// READ All Students
export const getStudents = async (_req: Request, res: Response) => {
  const students = await Student.find();
  res.json(students);
};

// READ Single Student
export const getStudentById = async (req: Request, res: Response) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(student);
};

// UPDATE
export const updateStudent = async (req: Request, res: Response) => {
  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updated) return res.status(404).json({ message: "Student not found" });
  res.json(updated);
};

// DELETE
export const deleteStudent = async (req: Request, res: Response) => {
  const deleted = await Student.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Student not found" });
  res.json({ message: "Deleted" });
};

// ADD Vaccination Record
export const addVaccinationRecord = async (req: Request, res: Response) => {
  const { vaccineName, driveId, dateOfVaccination } = req.body;
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });

  if (student.isVaccinatedWith(vaccineName)) {
    return res
      .status(400)
      .json({ message: "Student already vaccinated with this vaccine" });
  }

  student.vaccinationRecords.push({ vaccineName, driveId, dateOfVaccination } as IVaccinationRecord);
  await student.save();
  res.status(200).json(student);
};
