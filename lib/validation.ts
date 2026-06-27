import { z } from "zod";

// Shared registration schema
export const registrationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name cannot exceed 50 characters" }),

  lastName: z
    .string()
    .trim()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name cannot exceed 50 characters" }),

  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Enter a valid email address" })
    .max(150, { message: "Email cannot exceed 150 characters" }),

  companyName: z
    .string()
    .trim()
    .min(1, { message: "Company name is required" })
    .max(100, { message: "Company name cannot exceed 100 characters" }),

  companyRegistrationNo: z
    .string()
    .trim()
    .max(50, { message: "Registration number cannot exceed 50 characters" })
    .optional()
    .or(z.literal("")),

  contactNumber: z
    .string()
    .trim()
    .min(5, { message: "Valid contact number is required (min 5 digits)" })
    .max(25, { message: "Contact number cannot exceed 25 characters" }),

  role: z
    .string()
    .trim()
    .min(1, { message: "Designation is required" })
    .max(100, { message: "Designation cannot exceed 100 characters" }),

  address: z
    .string()
    .trim()
    .min(5, { message: "Full address is required (min 5 characters)" })
    .max(200, { message: "Address cannot exceed 200 characters" }),

  city: z
    .string()
    .trim()
    .min(1, { message: "City is required" })
    .max(100, { message: "City name is too long" }),

  state: z
    .string()
    .trim()
    .min(1, { message: "State/Province is required" })
    .max(100, { message: "State/Province is too long" }),

  zipCode: z
    .string()
    .trim()
    .min(1, { message: "Zip/Postal Code is required" })
    .max(15, { message: "Zip/Postal Code cannot exceed 15 characters" }),

  country: z
    .string()
    .trim()
    .min(1, { message: "Country is required" })
    .max(100, { message: "Country name is too long" }),

  numberOfAgents: z.preprocess(
    (val) => {
      if (typeof val === "string" && val.trim() !== "") {
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? undefined : parsed;
      }
      return val;
    },
    z
      .number({ message: "Number of agents is required" })
      .int()
      .min(1, { message: "Must have at least 1 agent" })
      .max(10000, { message: "Agent count cannot exceed 10,000" })
  ),

  typeOfAgents: z.enum(["Voice", "Bots"], {
    message: "Type of agents must be Voice or Bots",
  }),

  campaign: z
    .string()
    .trim()
    .min(2, { message: "Campaign description is required (min 2 characters)" })
    .max(100, { message: "Campaign name is too long" }),

  dialDNC: z.enum(["yes", "no"], {
    message: "Please specify if you dial DNC numbers",
  }),

  additionalInfo: z
    .string()
    .trim()
    .max(1000, { message: "Additional details cannot exceed 1000 characters" })
    .optional()
    .or(z.literal("")),

  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;