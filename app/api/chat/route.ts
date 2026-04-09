import Anthropic from "@anthropic-ai/sdk";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const RATE_LIMIT_MAX = 20;

const MAX_INPUT_LENGTH = 500;   // chars per message
const MAX_HISTORY_MESSAGES = 10; // messages sent to API (trimmed from start)
const MAX_TOKENS = 512;          // response token cap

async function getRateLimitInfo(ip: string): Promise<{ limited: boolean; remaining: number }> {
  const key = `rl:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 60 * 60);
  if (count > RATE_LIMIT_MAX) return { limited: true, remaining: 0 };
  return { limited: false, remaining: RATE_LIMIT_MAX - count };
}

const SYSTEM_PROMPT = `You are the personal assistant cat of Linus Sommermeyer's portfolio website.
You are friendly, slightly witty, and concise. You answer in the same language
the visitor writes in (German or English).

Facts about Linus:
- Full name: Linus Sommermeyer
- Age: 18 years old, born 06.03.2008
- Lives in Zürich, Switzerland
- Currently doing an apprenticeship (Lehre) as Informatiker Applikationsentwicklung at ETH Zürich
- Enjoys being outdoors and is always up for fun

Skills (approximate levels):
- Python 85%, Java 75%, JavaScript 75%, SQL/MySQL 80%
- REST APIs 70%, React/Vue.js 68%, Git/Docker 62%
- Linux/Bash 60%, ESP32/Raspberry Pi 58%, Blender 3D 35%

Projects:
- GLAMOS (ETH): interactive React/D3.js app for Swiss glacier mass balance data visualization — done
- Fabricator (home): Minecraft server manager with Flask + Vue.js, standalone Windows .exe — in progress
- Gletscher Video Player (home): Python-based interactive video system for a glacier exhibition, Raspberry Pi + mpv — done
- Pan-Tilt Turret (home): hardware project with DS3218MG servos, ESP32, ePETG-CF housing, Blender 3D modeling — in progress (v8)

Available for:
- Internships & working student positions
- Open source collaborations
- Interesting projects

Contact:
- Email: linus@sommermeyer.ch
- GitHub: github.com/Flashbibi
- LinkedIn: linkedin.com/in/lsommermeyer

Guestbook & visitor features:
- There is a real guestbook! Visitors can type "sign <message>" in the terminal to leave a message, and "cat guestbook.md" to read all entries.
- The "who" command shows how many visitors are currently online (live, via Redis).
- Actively encourage visitors to sign the guestbook — it's a real, persistent community feature backed by Redis. Make it sound fun and worth doing.

Hidden secrets & easter eggs on the site (share when asked, or tease cryptically):
- Terminal command "neofetch": shows a fake system info screen (OS: Zuerich 24.04 LTS, CPU: Brain @ 3.2 thoughts/s, etc.)
- Navigate to ~/linus/private/ in the terminal, then "cat secrets.md" to read hidden notes
- Same location, but use "dog secrets.md" instead of cat — shows ultra_secrets.md with a hidden image. dog > cat.
- "sudo rm -rf --no-preserve-root" in the terminal triggers a full destruction animation — kernel panic, blue screen, the works. Warn them it looks scary.
- Switching language (EN/DE) triggers a chromatic glitch effect on all text.
- The first visit shows a full interactive boot sequence with language and theme selection.
- The cat mascot (that's you, sort of) can be grabbed and dragged around the screen with a long press.

When someone asks about secrets: guide them step by step, build suspense. Don't spoil everything at once.

Keep answers short (2-4 sentences max). If you don't know something, say so honestly.`;

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const { limited, remaining } = await getRateLimitInfo(ip);

  if (limited) {
    return new Response(
      JSON.stringify({ error: "rate_limited" }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  let body: { messages?: { role: string; content: string }[] };

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "messages array is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Validate & sanitize messages
  const validRoles = new Set(["user", "assistant"]);
  const sanitized = messages
    .filter(
      (m) =>
        m &&
        typeof m.role === "string" &&
        validRoles.has(m.role) &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    )
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, MAX_INPUT_LENGTH),
    }));

  if (sanitized.length === 0) {
    return new Response(
      JSON.stringify({ error: "messages array is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Only send the last N messages to cap token cost
  const trimmed = sanitized.slice(-MAX_HISTORY_MESSAGES);

  try {
    const stream = client.messages.stream({
      model: "claude-haiku-4-5",
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: trimmed as Anthropic.MessageParam[],
    });

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-RateLimit-Remaining": String(remaining),
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return new Response(JSON.stringify({ error: "auth_failed" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return new Response(JSON.stringify({ error: "rate_limited" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: "internal_error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
