import mongoose, { Document, Schema } from "mongoose";
import { IStudent } from "./Student";
import { IVaccinationDrive } from "./VaccinationDrive";

export interface IVaccinationRecord extends Document {
  studentId: mongoose.Types.ObjectId | IStudent;
  vaccinationDriveId: mongoose.Types.ObjectId | IVaccinationDrive;
  vaccinated: boolean;
  vaccinationDate: Date | null;
  administeredBy?: string; // Optional
  batchNumber?: string; // Optional
  notes?: string; // Optional
};

const VaccinationRecordSchema: Schema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  vaccinationDriveId: { type: Schema.Types.ObjectId, ref: 'VaccinationDrive', required: true },
  vaccinated: { type: Boolean, default: false },
  vaccinationDate: { type: Date, default: null },
  administeredBy: { type: String },
  batchNumber: { type: String },
  notes: { type: String },
  // other record details
}); 

export const VaccinationRecord = mongoose.model<IVaccinationRecord>("VaccinationRecord", VaccinationRecordSchema);