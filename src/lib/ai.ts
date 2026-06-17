import ZAI from "z-ai-web-dev-sdk";

/**
 * Shared AI helper for NutriFit.
 * z-ai-web-dev-sdk MUST run on the backend only — this module is only
 * imported from server / route-handler code.
 */

let zaiPromise: Promise<ZAI> | null = null;

export async function getZAI(): Promise<ZAI> {
  if (!zaiPromise) {
    zaiPromise = ZAI.create();
  }
  return zaiPromise;
}

/**
 * Run a single completion turn and return the raw text content.
 * The "assistant" role carries the system prompt per the SDK convention.
 */
export async function aiComplete(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
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
 * ```json ... ``` fences or contain stray prose. Falls back to scanning
 * for the first balanced {/[ and last }/].
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
