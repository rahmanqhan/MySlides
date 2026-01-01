export const config = {
  runtime: "nodejs",
};

import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key missing on server" });
  }

  // ---- Timeout handling ----
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "X-Title": "MySlides",
        },
        body: JSON.stringify({
          // Faster + more reliable than Llama-3.1 for serverless
          model: "mistralai/mistral-7b-instruct",
          messages: [{ role: "user", content: prompt }],
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err: any) {
    if (err.name === "AbortError") {
      return res
        .status(504)
        .json({ error: "OpenRouter request timed out" });
    }

    return res.status(500).json({
      error: "Unexpected server error",
      details: err?.message,
    });
  } finally {
    clearTimeout(timeout);
  }
}
