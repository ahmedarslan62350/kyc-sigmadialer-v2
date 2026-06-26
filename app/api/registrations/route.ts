import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Registration from "@/models/Registration";

// GET all registrations
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const list = await Registration.find().sort({ createdAt: -1 });
    return NextResponse.json({
      success: true,
      count: list.length,
      data: list.map(doc => doc.toObject()),
    });
  } catch (err: any) {
    console.error("[API /api/registrations] Fetch failure:", err);
    return NextResponse.json(
      {
        error: "Failed to retrieve registration database records",
        details: err?.message || err,
      },
      { status: 500 }
    );
  }
}

// DELETE a registration by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID parameter is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const result = await Registration.findByIdAndDelete(id);
    
    if (result) {
      return NextResponse.json({ success: true, message: "Record deleted successfully" });
    } else {
      return NextResponse.json(
        { error: "Record not found or already deleted" },
        { status: 404 }
      );
    }
  } catch (err: any) {
    console.error("[API /api/registrations] Delete failure:", err);
    return NextResponse.json(
      {
        error: "Failed to delete record",
        details: err?.message || err,
      },
      { status: 500 }
    );
  }
}
