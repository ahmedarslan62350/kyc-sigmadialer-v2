import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Registration from "@/models/Registration";
import { registrationSchema } from "@/lib/validation";
import { createDiditSession } from "@/lib/didit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("[API /api/register] Received onboarding data for:", body.companyName);

    // Perform validation using Zod schema
    const validationResult = registrationSchema.safeParse(body);
    if (!validationResult.success) {
      console.warn("[API /api/register] Validation failed:", validationResult.error.flatten());
      return NextResponse.json(
        {
          error: "Validation failed",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Save valid data to MongoDB
    const result = new Registration(validationResult.data);
    const savedDoc = await result.save();
    console.log(`[API /api/register] Saved successfully to MongoDB`);

    // Create Didit verification session
    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const callbackUrl = `${appUrl}/success`;
    
    // Exclude agent-related fields from Didit session
    const { typeOfAgents, ...sessionData } = validationResult.data;
    
    const diditSession = await createDiditSession(
      savedDoc._id.toString(),
      callbackUrl,
      sessionData
    );

    if (!diditSession.success) {
      console.error("[API /api/register] Failed to create Didit session:", diditSession.error);
      // Still return success for registration, but note verification issue
      return NextResponse.json(
        {
          message: "Registration successful but verification session creation failed",
          dbType: "mongodb",
          data: savedDoc.toObject(),
          verification_error: diditSession.error,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        message: "Registration successful",
        dbType: "mongodb",
        data: savedDoc.toObject(),
        verification: {
          session_id: diditSession.session_id,
          verification_url: diditSession.verification_url,
          status: diditSession.status,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[API /api/register] Critical failure during registration:", err);
    return NextResponse.json(
      {
        error: "Internal server error saving registration",
        details: err?.message || "Please verify database configuration.",
      },
      { status: 500 }
    );
  }
}
