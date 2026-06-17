import { API_CONFIG } from "@/lib/api-config";

const env = import.meta.env;

export const SANDBOX_BASE_URL = env.VITE_SANDBOX_BASE_URL ?? API_CONFIG.IDP_BASE_URL;
export const SANDBOX_CLIENT_ID = env.VITE_SANDBOX_CLIENT_ID ?? "sandbox_pollus_test";
export const SANDBOX_CLIENT_SECRET = env.VITE_SANDBOX_CLIENT_SECRET ?? "sk_test_pollus_xxxxxxxxxxxxxxxx";
export const SANDBOX_REDIRECT_URI = `${API_CONFIG.DOCS_BASE_URL}/sandbox/callback`;

export const AVAILABLE_SCOPES = [
  "profile",
  "verifications",
  "doctor_license",
  "zkp",
  "mcp",
] as const;

export const SCOPE_DESCRIPTIONS: Record<string, string> = {
  profile: "Basic user profile claims — name, email, photo, and ID verification status.",
  verifications: "Identity verification data, including ID and face-match results.",
  doctor_license: "Medical/nursing license details for verified healthcare practitioners.",
  zkp: "Zero-knowledge proof age checks (is_18 / is_21 / is_25) that confirm an age threshold without revealing the user's birth date.",
  mcp: "Model Context Protocol endpoints for AI agents to access authorized identity data.",
};

export const DEFAULT_SCOPES = new Set<string>(["profile", "verifications"]);

export type DemoUser = "simple" | "nurse" | "doctor";

export const DEMO_USERS: { id: DemoUser; label: string; desc: string }[] = [
  { id: "simple", label: "Simple", desc: "no licenses" },
  { id: "nurse", label: "Nurse", desc: "verified nursing license" },
  { id: "doctor", label: "Doctor", desc: "verified medical license" },
];
