import axios from "axios";

const DIDIT_API_KEY = process.env.DIDIT_API_KEY;
const WORKFLOW_ID = process.env.WORKFLOW_ID;

interface DiditSessionResponse {
  success: boolean;
  session_id?: string;
  session_token?: string;
  verification_url?: string;
  status?: string;
  error?: any;
}

interface DiditSessionData {
  session_id: string;
  session_token: string;
  url: string;
  status: string;
}

export async function createDiditSession(
  vendorUserId: string,
  callbackUrl: string,
  formData?: any
): Promise<DiditSessionResponse> {
  // Validate required environment variables
  if (!DIDIT_API_KEY) {
    console.error("DIDIT_API_KEY is not configured");
    return {
      success: false,
      error: "Didit API key is not configured",
    };
  }

  if (!WORKFLOW_ID) {
    console.error("WORKFLOW_ID is not configured");
    return {
      success: false,
      error: "Didit workflow ID is not configured",
    };
  }

  // Validate input parameters
  if (!vendorUserId || typeof vendorUserId !== "string") {
    return {
      success: false,
      error: "Invalid vendor user ID",
    };
  }

  if (!callbackUrl || typeof callbackUrl !== "string") {
    return {
      success: false,
      error: "Invalid callback URL",
    };
  }

  try {
    console.log("⏳ Creating Didit session for user:", vendorUserId);

    const response = await axios.post<DiditSessionData>(
      "https://verification.didit.me/v3/session/",
      {
        workflow_id: WORKFLOW_ID,
        vendor_data: vendorUserId,
        callback: callbackUrl,
        callback_method: "both",
        metadata: {
          userId: vendorUserId,
          ...formData,
        },
        language: "en",
        contact_details: {
          send_notification_emails: false,
        },
      },
      {
        headers: {
          "x-api-key": DIDIT_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    const session = response.data;

    console.log("🚀 Didit session created:", session.session_id);

    return {
      success: true,
      session_id: session.session_id,
      session_token: session.session_token,
      verification_url: session.url,
      status: session.status,
    };
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Didit API Error:", error.response.data);
      return {
        success: false,
        error: error.response.data || "Didit API error",
      };
    }

    console.error("Didit Internal Error:", error);
    return {
      success: false,
      error: error.message || "Internal server error during Didit session creation",
    };
  }
}