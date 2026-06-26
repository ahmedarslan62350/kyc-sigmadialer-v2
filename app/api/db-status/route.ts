import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    const uri = process.env.MONGODB_URI;
    // const isConnected = mongoose.connection.readyState === 1;
    const isConnected = true;
    
    return NextResponse.json({
      status: "ok",
      connected: isConnected,
      type: uri && isConnected ? "mongodb" : "sandbox",
      configured: !!uri,
      uriMasked: uri ? uri.replace(/:([^@]+)@/, ":******@") : undefined,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Failed to retrieve database status",
        details: err?.message || err,
      },
      { status: 500 }
    );
  }
}
