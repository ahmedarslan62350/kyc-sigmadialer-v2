import mongoose, { Document, Schema } from "mongoose";

export interface IRegistration extends Document {
  firstName: string;
  lastName: string;
  companyName: string;
  companyRegistrationNo?: string;
  contactNumber: string;
  role: string;
  callingLocation: "USA" | "Canada";
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  teamsId: string;
  numberOfAgents: number;
  typeOfAgents: "Voice" | "Bots";
  campaign: string;
  dialDNC: "yes" | "no";
  additionalInfo?: string;
  termsAccepted: boolean;
  createdAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    companyRegistrationNo: { type: String, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    callingLocation: { type: String, enum: ["USA", "Canada"], required: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zipCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    teamsId: { type: String, required: true, trim: true },
    numberOfAgents: { type: Number, required: true },
    typeOfAgents: { type: String, enum: ["Voice", "Bots"], required: true },
    campaign: { type: String, required: true, trim: true },
    dialDNC: { type: String, enum: ["yes", "no"], required: true },
    additionalInfo: { type: String, trim: true },
    termsAccepted: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const Registration =
  mongoose.models.Registration || mongoose.model<IRegistration>("Registration", RegistrationSchema);

export default Registration;
