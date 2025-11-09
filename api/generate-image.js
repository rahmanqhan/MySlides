export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    // New official Router endpoint
    const HF_URL =
      "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-2";

    const response = await fetch(HF_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    // Capture non-200 responses
    if (!response.ok) {
      let errMsg = await response.text();
      console.error("HF error:", errMsg);
      return res
        .status(response.status)
        .json({ error: "HF API failed", details: errMsg });
    }

    // Hugging Face now sometimes returns base64 JSON instead of raw binary
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (data.error) {
        console.error("HF returned error JSON:", data);
        return res.status(500).json({ error: data.error });
      }
    }

    // Convert binary buffer to send image
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.setHeader("Content-Type", "image/png");
    res.status(200).send(buffer);
  } catch (error) {
    console.error("Server crashed:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
