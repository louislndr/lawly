import { GoogleGenAI } from "@google/genai";

let _client: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!_client) {
    _client = new GoogleGenAI({
      vertexai: true,
      project: process.env.GOOGLE_CLOUD_PROJECT ?? "lawly001",
      location: process.env.GOOGLE_CLOUD_LOCATION ?? "us-central1",
    });
  }
  return _client;
}
