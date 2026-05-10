import { GoogleAuth } from "google-auth-library";

const PROJECT = process.env.GOOGLE_CLOUD_PROJECT ?? "lawly00";
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION ?? "us-central1";

async function getAccessToken(): Promise<string> {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  let serviceAccount: Record<string, string> | undefined;

  if (raw) {
    const parsed = JSON.parse(raw);
    if (parsed.private_key) {
      parsed.private_key = (parsed.private_key as string).replace(/\\n/g, "\n");
    }
    serviceAccount = parsed;
  }

  console.log("Google auth mode", {
    hasServiceAccountJson: !!raw,
    project: PROJECT,
    location: LOCATION,
    parsedClientEmail: serviceAccount?.client_email ?? "ADC",
  });

  const auth = new GoogleAuth({
    ...(serviceAccount ? { credentials: serviceAccount } : {}),
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const authClient = await auth.getClient();
  const tokenResponse = await authClient.getAccessToken();
  const accessToken =
    typeof tokenResponse === "string" ? tokenResponse : tokenResponse?.token;

  if (!accessToken) throw new Error("Failed to obtain Google access token");
  return accessToken;
}

interface GenerateContentParams {
  model: string;
  contents: string;
  config?: {
    temperature?: number;
    maxOutputTokens?: number;
    responseMimeType?: string;
  };
}

export function getGeminiClient() {
  return {
    models: {
      async generateContent(params: GenerateContentParams) {
        const { model, contents, config = {} } = params;
        const accessToken = await getAccessToken();

        const url =
          `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT}` +
          `/locations/${LOCATION}/publishers/google/models/${model}:generateContent`;

        const res = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: contents }] }],
            generationConfig: {
              temperature: config.temperature ?? 0.2,
              ...(config.maxOutputTokens != null
                ? { maxOutputTokens: config.maxOutputTokens }
                : {}),
              ...(config.responseMimeType
                ? { responseMimeType: config.responseMimeType }
                : {}),
            },
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Vertex AI ${res.status}: ${errText}`);
        }

        const data = await res.json();
        const text: string =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        return { text };
      },
    },
  };
}
