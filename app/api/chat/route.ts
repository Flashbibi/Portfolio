import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// In-memory rate limit store: ip -> { count, resetAt }
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 20;       // requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) return true;

  entry.count++;
  return false;
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
- Email: linus.sommermeyer@lernende.ethz.ch
- GitHub: github.com/Flashbibi
- LinkedIn: linkedin.com/in/linus-sommermeyer-a776142a2

Keep answers short (2-4 sentences max). If you don't know something, say so honestly.`;

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: { messages?: { role: string; content: string }[] };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { messages } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "messages array is required and must not be empty" },
      { status: 400 }
    );
  }

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages as Anthropic.MessageParam[],
    });

    const textBlock = response.content.find(
      (block): block is Anthropic.TextBlock => block.type === "text"
    );
    const reply = textBlock?.text ?? "";

    return NextResponse.json({ reply });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }
    if (error instanceof Anthropic.BadRequestError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: "API error" },
        { status: error.status ?? 500 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
