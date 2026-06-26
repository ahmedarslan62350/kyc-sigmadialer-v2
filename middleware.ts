import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Only check IP for admin routes
  if (path.startsWith("/admin")) {
    const allowedIps = process.env.ALLOWED_IPS;
    
    // If ALLOWED_IPS is not set, allow access (for development)
    if (!allowedIps) {
      return NextResponse.next();
    }
    
    // Get client IP from various headers
    const ip = getClientIp(request);
    
    // Parse allowed IPs from comma-separated string
    const allowedIpList = allowedIps.split(",").map((ip) => ip.trim());
    
    // Check if client IP is in allowed list
    if (!allowedIpList.includes(ip)) {
      // Return 403 Forbidden
      return new NextResponse("Access Denied: Your IP is not authorized to access this page.", {
        status: 403,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }
  }
  
  return NextResponse.next();
}

function getClientIp(request: NextRequest): string {
  // Check various headers for the client IP
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    let ip = forwarded.split(",")[0].trim();
    // Remove IPv6 prefix if present (::ffff:)
    if (ip.startsWith("::ffff:")) {
      ip = ip.replace("::ffff:", "");
    }

    console.log("Forwarded:", ip);
    
    return ip;
  }
  
  if (realIp) {
    let ip = realIp;
    // Remove IPv6 prefix if present (::ffff:)
    if (ip.startsWith("::ffff:")) {
      ip = ip.replace("::ffff:", "");
    }
    console.log("Real IP:", ip);
    return ip;
  }
  
  if (cfConnectingIp) {
    let ip = cfConnectingIp;
    // Remove IPv6 prefix if present (::ffff:)
    if (ip.startsWith("::ffff:")) {
      ip = ip.replace("::ffff:", "");
    }
    console.log("CF Connecting IP:", ip);
    return ip;
  }
  
  // Fallback to remote address (not available in edge runtime, but kept for completeness)
  return "unknown";
}

export const config = {
  matcher: "/admin/:path*",
};

