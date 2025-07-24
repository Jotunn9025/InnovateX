// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    console.log("➡️ Forwarding login to backend with body:", req.body);

    const backendRes = await axios.post(
      "http://localhost:5000/api/auth/login",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(backendRes.status).json(backendRes.data);
  } catch (error: any) {
    console.error("❌ API Route Error:", error.message);
    console.error("❌ Backend response:", error.response?.data);

    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Login failed",
    });
  }
}
