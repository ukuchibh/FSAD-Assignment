import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  name: string;
  class: string;
  studentId: string;
  guardian?: string;
  dateOfBirth?: Date; // Optional
  gender?: string; // Optional
  contactNumber?: string; // Optional
  address?: string; // Optional
}

// Student Model
const StudentSchema: Schema = new Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  guardian: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String },
  contactNumber: { type: String },
  address: { type: String },
});

export const Student = mongoose.model<IStudent>("Student", StudentSchema);