export default async function handler(req, res) {
    try {
        const { prompt } = await req.json();

        // Call Hugging Face API securely from Vercel backend
        const response = await fetch("https://api-inference.huggingface.co/models/prompthero/openjourney", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.HF_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: prompt }),
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: "Hugging Face request failed" });
        }

        // Convert image to base64
        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");

        res.status(200).json({
            image: `data:image/png;base64,${base64}`,
        });
    } catch (err) {
        console.error("Image proxy error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}
