import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Only check admin routes
  if (path.startsWith("/admin")) {
    const allowedIps = process.env.ALLOWED_IPS;

    // --- Step 1: IP allowlist check (unchanged behavior) ---
    // If ALLOWED_IPS is not set, skip the IP check entirely (dev convenience).
    if (allowedIps) {
      const ip = getClientIp(request);
      const allowedIpList = allowedIps.split(",").map((entry) => entry.trim());

      if (!allowedIpList.includes(ip)) {
        return new NextResponse("Access Denied: Your IP is not authorized to access this page.", {
          status: 403,
          headers: {
            "Content-Type": "text/plain",
          },
        });
      }
    }

    // --- Step 2: Password check via HTTP Basic Auth ---
    // Only IPs that passed Step 1 (or all IPs, if ALLOWED_IPS is unset) get this far.
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminUsername = process.env.ADMIN_USERNAME;
    // If no password is configured, skip auth entirely (dev convenience).
    if (adminPassword && adminUsername) {
      const authHeader = request.headers.get("authorization");

      if (!isAuthorized(authHeader, adminUsername, adminPassword)) {
        return new NextResponse("Authentication required.", {
          status: 401,
          headers: {
            // Browser will show its native Basic Auth popup because of this header.
            "WWW-Authenticate": 'Basic realm="Admin Area", charset="UTF-8"',
          },
        });
      }
    }
  }

  return NextResponse.next();
}

/**
 * Validates an HTTP Basic Auth header against the configured admin username and password.
 * Username is ignored / can be anything — only the password is checked.
 */
function isAuthorized(authHeader: string | null, expectedUsername: string, expectedPassword: string): boolean {
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return false;
  }

  try {
    const base64Credentials = authHeader.slice("Basic ".length).trim();
    // atob is available in the Edge runtime (middleware), unlike Buffer in some configs.
    const decoded = atob(base64Credentials);
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex === -1) return false;

    const username = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);
    return username === expectedUsername && password === expectedPassword;
  } catch {
    return false;
  }
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