// pages/api/auth/signup.ts

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
    console.log("➡️ Sending signup to backend:", req.body);

    const backendRes = await axios.post(
      "http://localhost:5000/api/auth/signup",
      req.body
    );

    return res.status(backendRes.status).json(backendRes.data);
  } catch (error: any) {
    console.error(
      "❌ Error forwarding to backend:",
      error.response?.data || error.message
    );

    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Signup failed",
    });
  }
}
