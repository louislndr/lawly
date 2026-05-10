import { GoogleGenAI } from "@google/genai";
import type { GoogleAuthOptions } from "google-auth-library";
import { JWT } from "google-auth-library";

let _client: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!_client) {
    const googleAuthOptions: GoogleAuthOptions = {};

    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (serviceAccountJson) {
      const parsed = JSON.parse(serviceAccountJson);
      const privateKey = (parsed.private_key as string).replace(/\\n/g, "\n");
      googleAuthOptions.authClient = new JWT({
        email: parsed.client_email,
        key: privateKey,
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
      });
    }

    _client = new GoogleGenAI({
      vertexai: true,
      project: process.env.GOOGLE_CLOUD_PROJECT ?? "lawly00",
      location: process.env.GOOGLE_CLOUD_LOCATION ?? "us-central1",
      googleAuthOptions,
    });
  }
  return _client;
}
