import mongoose, { Document, Schema} from "mongoose";

export interface IVaccinationDrive extends Document {
  vaccineName: string;
  date: Date;
  availableDoses: number;
  applicableClasses: string[];
  venue?: string; // Optional
  organizer?: string; // Optional
  notes?: string; // Optional
}

const VaccinationDriveSchema: Schema = new Schema({
  vaccineName: { type: String, required: true },
  date: { type: Date, required: true },
  availableDoses: { type: Number, required: true },
  applicableClasses: [{ type: String }],
  venue: { type: String },
  organizer: { type: String },
  notes: { type: String },
});


VaccinationDriveSchema.statics.isOverlapping = async function ({
  vaccineName,
  date,
  applicableClasses,
}: {
  vaccineName: string;
  date: Date;
  applicableClasses: string[];
}): Promise<boolean> {
  const overlapping = await this.findOne({
    vaccineName: vaccineName,
    date: {
      $eq: new Date(date.setHours(0, 0, 0, 0)), // match the same day (ignoring time)
    },
    applicableClasses: {
      $in: applicableClasses, // at least one class overlaps
    },
  });

  return !!overlapping;
};

export const VaccinationDrive = mongoose.model<IVaccinationDrive>(
  "VaccinationDrive",
  VaccinationDriveSchema
);
/*
const isOverlap = await VaccinationDrive.isOverlapping({
  vaccineName: 'Hepatitis B',
  date: new Date('2025-06-01'),
  applicableClasses: ['Grade 5', 'Grade 6'],
});

if (isOverlap) {
  console.log('Drive overlaps with an existing one.');
} else {
  console.log('No overlap. Safe to schedule.');
}
*/