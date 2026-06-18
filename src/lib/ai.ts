import ZAI from "z-ai-web-dev-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Shared AI helper for NutriFit.
 *
 * Dual-provider: uses Google Gemini when GEMINI_API_KEY is set (production /
 * Vercel), and falls back to the z-ai-web-dev-sdk (sandbox) otherwise. This
 * keeps the sandbox working without a key while making the app deployable.
 *
 * This module is server-only — never import from client code.
 */

// --- Gemini (production) ---
let geminiModel: ReturnType<
  GoogleGenerativeAI["getGenerativeModel"]
> | null = null;

function getGeminiModel() {
  if (geminiModel) return geminiModel;
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const genAI = new GoogleGenerativeAI(key);
  geminiModel = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  });
  return geminiModel;
}

// --- z-ai SDK (sandbox fallback) ---
let zaiPromise: Promise<ZAI> | null = null;

async function getZAI(): Promise<ZAI> {
  if (!zaiPromise) {
    zaiPromise = ZAI.create();
  }
  return zaiPromise;
}

/**
 * Run a single completion turn and return the raw text content.
 * The "assistant" role carries the system prompt per the z-ai SDK convention;
 * Gemini receives it as the first user-turn message.
 */
export async function aiComplete(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  // Prefer Gemini in production.
  const model = getGeminiModel();
  if (model) {
    try {
      const result = await model.generateContent(
        `${systemPrompt}\n\n${userPrompt}`
      );
      const text = result.response.text();
      if (text && text.trim()) return text.trim();
    } catch (err) {
      console.error("Gemini completion failed, falling back:", err);
      // fall through to z-ai SDK if Gemini errors
    }
  }

  // Sandbox fallback (z-ai-web-dev-sdk).
  const zai = await getZAI();
  const completion = await zai.chat.completions.create({
    messages: [
      { role: "assistant", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    thinking: { type: "disabled" },
  });
  const content = completion.choices?.[0]?.message?.content ?? "";
  return content.trim();
}

/**
 * Extract a JSON value from an LLM response that may be wrapped in
 * ```json ... ``` fences or contain stray prose.
 */
export function extractJSON<T = unknown>(raw: string): T {
  if (!raw) throw new Error("Empty AI response");

  // Strip markdown code fences if present.
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenceMatch ? fenceMatch[1] : raw;

  try {
    return JSON.parse(candidate.trim()) as T;
  } catch {
    // Fall through to bracket scanning.
  }

  // Try to locate the first JSON array or object.
  const arrayStart = candidate.indexOf("[");
  const objStart = candidate.indexOf("{");
  let start = -1;
  let openChar = "{";
  let closeChar = "}";

  if (objStart === -1 || (arrayStart !== -1 && arrayStart < objStart)) {
    start = arrayStart;
    openChar = "[";
    closeChar = "]";
  } else {
    start = objStart;
  }

  if (start === -1) throw new Error("No JSON found in AI response");

  const end = candidate.lastIndexOf(closeChar);
  if (end === -1 || end < start) throw new Error("Malformed JSON in AI response");

  const slice = candidate.slice(start, end + 1);
  return JSON.parse(slice) as T;
}

/**
 * Analyze a meal photo with AI vision and return structured nutrition data.
 *
 * Uses Gemini Vision (inline image part) when GEMINI_API_KEY is set,
 * otherwise falls back to the z-ai-web-dev-sdk vision endpoint.
 *
 * @param imageBase64 — base64-encoded image data (no data: prefix)
 * @param mimeType — e.g. "image/jpeg", "image/png"
 * @param prompt — the instruction for the vision model
 * @returns raw text response (caller parses JSON via extractJSON)
 */
export async function aiAnalyzeImage(
  imageBase64: string,
  mimeType: string,
  prompt: string
): Promise<string> {
  // --- Gemini Vision (production) ---
  const model = getGeminiModel();
  if (model) {
    try {
      const result = await model.generateContent([
        { text: prompt },
        {
          inlineData: {
            mimeType,
            data: imageBase64,
          },
        },
      ]);
      const text = result.response.text();
      if (text && text.trim()) return text.trim();
    } catch (err) {
      console.error("Gemini Vision failed, falling back:", err);
      // fall through to z-ai SDK
    }
  }

  // --- z-ai SDK vision fallback (sandbox) ---
  const zai = await getZAI();
  const dataUrl = `data:${mimeType};base64,${imageBase64}`;
  const completion = await zai.chat.completions.createVision({
    model: "glm-4.6v",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: dataUrl } },
        ],
      },
    ],
    thinking: { type: "disabled" },
  });
  const content = completion.choices?.[0]?.message?.content ?? "";
  return content.trim();
}
