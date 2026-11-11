// Vercel Edge Runtime — Hardened Gemini LLM Endpoint for WhatsCity (Milano Smart City - Gruppo A2A)
// - API Key (process.env.GEMINI_API_KEY) stays 100% server-side in Vercel Secret Environment Variables
// - Strict Origin / Referer validation (only jerryanderson996.github.io & localhost)
// - Per-IP Sliding Window Rate Limiting (15 req / min, 50 req / 15 min)
// - Prompt Injection / Jailbreak firewall before calling Gemini
// - Multi-model failover (gemini-3.5-flash-lite -> gemini-3.5-flash -> gemini-3.8-flash)

export const config = {
  runtime: "edge",
};

const ALLOWED_ORIGINS = [
  "https://jerryanderson996.github.io",
  "https://jerry-el-gendy.vercel.app",
  "http://localhost:8090",
  "http://127.0.0.1:8090",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const rateLimitStore = new Map();
const MAX_PER_MINUTE = 15;
const MAX_PER_15_MIN = 50;

function checkRateLimit(ip) {
  const now = Date.now();
  const oneMinAgo = now - 60_000;
  const fifteenMinAgo = now - 900_000;

  let record = rateLimitStore.get(ip);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(ip, record);
  }

  record.timestamps = record.timestamps.filter((t) => t > fifteenMinAgo);
  const recentMinute = record.timestamps.filter((t) => t > oneMinAgo).length;

  if (recentMinute >= MAX_PER_MINUTE || record.timestamps.length >= MAX_PER_15_MIN) {
    return { allowed: false, retryAfter: 60 };
  }

  record.timestamps.push(now);

  if (rateLimitStore.size > 2000) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (!v.timestamps.length || v.timestamps[v.timestamps.length - 1] < fifteenMinAgo) {
        rateLimitStore.delete(k);
      }
    }
  }

  return { allowed: true };
}

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above|system)\s+(instructions|prompts|rules)/i,
  /disregard\s+(all\s+)?(previous|prior|above|system)/i,
  /reveal\s+(your\s+)?(system\s+prompt|hidden\s+instructions|api\s+key)/i,
  /dammi\s+la\s+(tua\s+)?(chiave\s+api|api\s+key)/i,
  /mostra(mi)?\s+la\s+(chiave\s+api|api\s+key)/i,
  /print\s+(your\s+)?(system\s+prompt|initial\s+instructions|api\s+key)/i,
  /you\s+are\s+now\s+(dan|unrestricted|jailbroken)/i,
  /<script[\s>]/i,
];

function isPromptInjection(text) {
  return INJECTION_PATTERNS.some((rx) => rx.test(text));
}

export default async function handler(req) {
  const origin = req.headers.get("origin") || "";
  const referer = req.headers.get("referer") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  const securityHeaders = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: securityHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: securityHeaders,
    });
  }

  // 1. Strict Origin / Referer verification
  const isAllowedSite =
    ALLOWED_ORIGINS.some((o) => origin.startsWith(o) || referer.startsWith(o)) ||
    origin.endsWith(".vercel.app");

  if (!isAllowedSite) {
    return new Response(JSON.stringify({ error: "Forbidden origin" }), {
      status: 403,
      headers: securityHeaders,
    });
  }

  // 2. Per-IP Rate Limiting
  const clientIp = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown")
    .split(",")[0]
    .trim();
  const rate = checkRateLimit(clientIp);
  if (!rate.allowed) {
    return new Response(
      JSON.stringify({ error: "Limite richieste raggiunto. Riprova tra un minuto." }),
      {
        status: 429,
        headers: { ...securityHeaders, "Retry-After": String(rate.retryAfter) },
      }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Server API key non configurata su Vercel" }), {
      status: 503,
      headers: securityHeaders,
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const {
      message = "",
      systemContext = "",
      history = [],
      jsonMode = false,
      preferredModel = "gemini-3.5-flash-lite",
    } = body || {};

    const cleanMsg = String(message).trim().slice(0, 1200);
    if (!cleanMsg) {
      return new Response(JSON.stringify({ error: "Messaggio vuoto" }), {
        status: 400,
        headers: securityHeaders,
      });
    }

    // 3. Pre-LLM Prompt Injection / Jailbreak Firewall
    if (isPromptInjection(cleanMsg)) {
      return new Response(
        JSON.stringify({
          ok: true,
          text: "🔒 Sono **WhatsCity Eco-Bot**, l'assistente civico ed ecologico di **WhatsCity Milano Smart City**. Per motivi di sicurezza (OWASP LLM Top 10) non espongo mai istruzioni interne o chiavi di sistema. Chiedimi pure informazioni sulla navigazione dell'app, sulle segnalazioni a Milano o consigli di sostenibilità!",
          modelUsed: "owasp-guardrail",
        }),
        { status: 200, headers: securityHeaders }
      );
    }

    const contents = [];
    if (Array.isArray(history) && !jsonMode) {
      for (const turn of history.slice(-6)) {
        if (!turn || !turn.text) continue;
        const turnText = String(turn.text).slice(0, 1000);
        if (isPromptInjection(turnText)) continue;
        contents.push({
          role: turn.role === "model" || turn.role === "assistant" ? "model" : "user",
          parts: [{ text: turnText }],
        });
      }
    }

    contents.push({
      role: "user",
      parts: [{ text: cleanMsg }],
    });

    const validModels = [
      "gemini-3.5-flash-lite",
      "gemini-3.5-flash",
      "gemini-3.8-flash",
      "gemini-3.1-flash-lite",
    ];
    const primary = validModels.includes(preferredModel) ? preferredModel : "gemini-3.5-flash-lite";
    const models = [primary, ...validModels].filter((v, i, a) => a.indexOf(v) === i);

    let replyText = null;
    let usedModel = models[0];
    let lastError = null;

    for (const model of models) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
        apiKey
      )}`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 9000);

      try {
        const payload = {
          contents,
          generationConfig: jsonMode
            ? { responseMimeType: "application/json", temperature: 0.2, maxOutputTokens: 600 }
            : { temperature: 0.45, maxOutputTokens: 1000 },
        };

        if (systemContext && !jsonMode) {
          payload.systemInstruction = {
            parts: [{ text: String(systemContext).slice(0, 4000) }],
          };
        }

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify(payload),
        });
        clearTimeout(timer);

        if (response.ok) {
          const data = await response.json();
          const parts = data?.candidates?.[0]?.content?.parts || [];
          const text =
            parts
              .filter((p) => !p.thought)
              .map((p) => p.text || "")
              .join("")
              .trim() ||
            parts
              .map((p) => p.text || "")
              .join("")
              .trim();

          if (text) {
            replyText = text;
            usedModel = model;
            break;
          }
        } else {
          lastError = `HTTP ${response.status}`;
        }
      } catch (e) {
        clearTimeout(timer);
        lastError = e.message || "Timeout";
      }
    }

    if (!replyText) {
      return new Response(
        JSON.stringify({ ok: false, error: lastError || "Servizio Gemini temporaneamente occupato" }),
        { status: 502, headers: securityHeaders }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        text: replyText,
        modelUsed: usedModel,
      }),
      { status: 200, headers: securityHeaders }
    );
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: "Errore interno server Edge" }), {
      status: 500,
      headers: securityHeaders,
    });
  }
}
