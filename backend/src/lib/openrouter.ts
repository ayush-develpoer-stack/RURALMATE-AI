/**
 * Reusable OpenRouter client. All OpenRouter communication lives here.
 * The API key stays backend-only. Model is configurable via OPENROUTER_MODEL.
 *
 * If not configured (missing/placeholder key), callers should fall back to
 * deterministic output so the product keeps working.
 */

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
// "openrouter/free" is a real auto-routing model that picks an available free model.
const DEFAULT_MODEL = 'openrouter/free';
const TIMEOUT_MS = 25000;

function rawKey(): string {
  return (process.env.OPENROUTER_API_KEY || '').trim();
}

/** True only when a real key is present (not empty, not a placeholder). */
export function isAIConfigured(): boolean {
  const key = rawKey();
  if (!key) return false;
  if (/^your[_-]?/i.test(key)) return false; // e.g. "YOUR_OPENROUTER_KEY"
  return key.length > 12;
}

function model(): string {
  const m = (process.env.OPENROUTER_MODEL || '').trim();
  if (!m || /^your[_-]?/i.test(m)) return DEFAULT_MODEL;
  return m;
}

/** The model slug that will actually be sent to OpenRouter. */
export function activeModel(): string {
  return model();
}

export interface GenerateOptions {
  system?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Generate text from a prompt. Throws OpenRouterError on any failure so callers
 * can catch and fall back deterministically.
 */
export async function generateText(prompt: string, opts: GenerateOptions = {}): Promise<string> {
  if (!isAIConfigured()) {
    throw new OpenRouterError('OpenRouter is not configured', 'not_configured');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${rawKey()}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:3000',
        'X-Title': 'RuralMate AI',
      },
      body: JSON.stringify({
        model: model(),
        temperature: opts.temperature ?? 0.6,
        max_tokens: opts.maxTokens ?? 900,
        messages: [
          ...(opts.system ? [{ role: 'system', content: opts.system }] : []),
          { role: 'user', content: prompt },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      // Log the provider's error body server-side (never returned to the client).
      let detail = '';
      try {
        detail = await res.text();
      } catch {
        /* ignore */
      }
      // eslint-disable-next-line no-console
      console.error(`OpenRouter ${res.status} (model=${model()}):`, detail.slice(0, 500));

      if (res.status === 401 || res.status === 403) {
        throw new OpenRouterError('AI authentication failed (check API key)', 'unauthorized');
      }
      if (res.status === 429) {
        throw new OpenRouterError('AI rate limit reached', 'rate_limit');
      }
      if (res.status >= 500) {
        throw new OpenRouterError(`AI provider error (${res.status})`, 'server_error');
      }
      throw new OpenRouterError(`AI request failed (${res.status})`, 'http_error');
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) {
      throw new OpenRouterError('Empty AI response', 'empty');
    }
    return text;
  } catch (err) {
    if (err instanceof OpenRouterError) throw err;
    if (err instanceof Error && err.name === 'AbortError') {
      throw new OpenRouterError('AI request timed out', 'timeout');
    }
    throw new OpenRouterError('AI request error', 'network');
  } finally {
    clearTimeout(timer);
  }
}

export class OpenRouterError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}
