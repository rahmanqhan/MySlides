import { GoogleGenerativeAI } from "@google/generative-ai";
import { CardData } from "../types";

// Initialize Gemini model using Google AI Studio API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const textModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// ---------- Generate Basic Text ----------
export async function generateSlides(prompt: string): Promise<string> {
  const result = await textModel.generateContent(prompt);
  return result.response.text();
}

// ---------- Generate Image for Each Slide ----------
export async function generateImageForPrompt(prompt: string): Promise<string | undefined> {
  try {
    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      console.error("Hugging Face image request failed:", await response.text());
      return undefined;
    }

    const data = await response.json();
    if (data.image) {
      return data.image;
    } else {
      console.warn("No image returned from Hugging Face API");
      return undefined;
    }
  } catch (err) {
    console.error("Error generating image via Hugging Face:", err);
    return undefined;
  }
}

// ---------- Generate Full Presentation ----------
export const generatePresentationText = async (
  topic: string,
  updateLoadingMessage: (message: string) => void
): Promise<CardData[]> => {
  updateLoadingMessage("Drafting presentation outline...");

  const systemInstruction =`You are an expert presentation designer, tasked with creating a compelling, well-structured 10-slide presentation on the user's topic.

For each slide, you must provide:
1.  A 'title' for the slide.
2.  'content' in well-structured markdown format, following the strict rules below.
3.  A detailed and unique 'imagePrompt' for an AI to generate a relevant, high-quality image. Every slide, regardless of layout, MUST have a distinct and descriptive image prompt.
4.  A 'layout' from this list: ['title', 'text_image', 'image_text', 'text_only'].

---

### Image Prompt Generation Rules (VERY IMPORTANT)
To ensure the generated images are highly relevant and visually compelling, your 'imagePrompt' MUST follow these guidelines:

1.  **Be Specific and Concrete:** The prompt must be directly inspired by the slide's 'title' and 'content'. Avoid generic or abstract concepts. Describe a tangible scene, object, or action.
    - **GOOD Example:** If the slide content is about "Q3 Sales Growth", a good prompt is: \`A photorealistic image of an upward-trending bar chart with glowing blue bars, set against a dark, modern corporate background.\`
    - **BAD Example:** \`Business success.\` (This is too vague).

2.  **Incorporate a Visual Style:** Add descriptive keywords that define the artistic style of the image. This leads to more precise and higher-quality visuals.
    - **Recommended Styles:** 'photorealistic', 'cinematic lighting', 'minimalist vector illustration', 'abstract digital art', 'vintage photograph', 'futuristic concept art'.
    - **GOOD Example:** \`A minimalist vector illustration of a brain with interconnected nodes, symbolizing AI learning.\`

3.  **Create Unique Prompts:** Each slide needs a distinct image. Do not repeat prompts. Even for similar topics, find a new angle or visual metaphor.
    
4.  **Rules for Background Images (CRITICAL FOR LEGIBILITY):**
    - For slides with **'title'** or **'text_only'** layouts, the image will be a full-screen background behind white text.
    - The prompt **MUST** generate an image that ensures text is clearly visible.
    - **Use keywords** like 'dark aesthetic', 'dark background', 'subtle abstract pattern', 'ambient lighting', 'minimalist dark texture', or ensure the prompt describes a scene with a large, non-distracting dark area.
    - **GOOD Example for a Title Slide:** \`An elegant, dark abstract background with subtle, glowing blue and purple neural network lines, cinematic quality, with plenty of negative space on the left for text overlay.\`
    - **BAD Example:** \`A bright, sunny day in a busy city park.\` (This would make white text unreadable).

---

### Slide-by-Slide Content Instructions
- **Slide 1 (Title Slide):** Use the 'title' layout. The 'content' must include a compelling subtitle and a very detailed, engaging introductory paragraph of about **160-200 words** (approximately 8-12 sentences) to provide a solid, in-depth background on the presentation's topic. This slide needs to be rich in content.
- **Slide 2 (Agenda/Overview):** This slide must provide a clear overview. The 'content' should be a bulleted list outlining the key sections of the presentation.
- **Slide 10 (Conclusion):** This must be a strong conclusion. The 'content' should summarize the key takeaways in a bulleted list and end with a final concluding thought or a call to action.
- **Slides with 'text_image' or 'image_text' layouts:** These slides balance text and visuals. The 'content' should be focused and clear, providing key information without being overly dense. Aim for around **50-70 words** per slide.
- **Slides with 'text_only' layout:** These slides are designed for dense information. The 'content' should be comprehensive, often using detailed bulleted lists or multiple paragraphs to fully explain a concept. Aim for around **100-120 words** for these slides.
- **Other Slides (3-9):** Develop the core topics of the presentation logically. Ensure there is sufficient, meaningful content on each slide. Avoid creating slides with very little text, adhering to the word counts above based on the chosen layout.

---

### Markdown Formatting Rules (VERY IMPORTANT)
Your markdown content MUST follow these rules strictly to ensure correct rendering:

1.  **Headings:**
    - Use '##' for main slide topics and '###' for sub-topics.
    - **NEVER** use a single '#' for headings in the content, as the slide title is handled separately.
    - Example: \`## Our Q3 Strategy\`

2.  **Lists:**
    - Use a single asterisk followed by a space ('* ') for all bullet points.
    - GOOD: \`* This is a correct bullet point.\`
    - BAD: \`- This is incorrect.\`
    - BAD: \`*This is incorrect (missing space).\`

3.  **Bold Text:**
    - Use double asterisks ('**text**') ONLY for emphasizing a few (1-3) critical keywords within a sentence.
    - Bolding should be rare and for impact.
    - **GOOD Example:** The results were **significantly** better than projected.
    - **BAD Example:** **The results were significantly better than projected.** (NEVER bold an entire sentence).
    - **BAD Example:** **Key Findings:** (NEVER use bolding as a substitute for a proper '##' or '###' heading).

4.  **Overall Structure:**
    - Do not bold entire list items. Emphasize a word *inside* the item if absolutely necessary.
    - GOOD: \`* Our primary goal is **growth**.\`
    - BAD: \`* **Our primary goal is growth.**\`

---

### Layout Instructions
- Use the 'title' layout ONLY for the very first slide.
- Use 'text_image' for a standard slide with explanatory text on the left and a visual on the right.
- Use 'image_text' for a slide with a visual on the left and text on the right.
- Use 'text_only' for slides that are heavy on text, like lists or key takeaways. You can still provide an image prompt for a background or abstract visual.

Ensure the presentation flows logically, is visually engaging, and contains exactly 10 slides.`;

  const prompt = `
${systemInstruction}

Now create a structured JSON array of exactly 10 slides about: ${topic}.
Each slide must follow the defined format exactly.
`;

  const result = await textModel.generateContent(prompt);
  updateLoadingMessage("Parsing content structure...");

  // --- Extract JSON ---
  let rawText = result.response.text().trim();
  rawText = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .replace(/```/g, "")
    .trim();

  // --- Parse JSON safely ---
  let structuredResponse: any[];
  try {
    structuredResponse = JSON.parse(rawText);
  } catch (e) {
    console.error("Failed to parse JSON response:", rawText);
    throw new Error("The AI returned formatted text instead of valid JSON. Please try again.");
  }

  // --- Convert JSON into CardData format ---
  const cards: CardData[] = structuredResponse.map((item: any, index: number) => ({
    id: `card-${index}-${Date.now()}`,
    title: item.title,
    content: item.content,
    imagePrompt: item.imagePrompt,
    layout: item.layout || "text_image",
  }));

  return cards;
};

// ---------- Generate Presentation Images ----------
export const generatePresentationImages = async (
  cards: CardData[],
  onCardUpdate: (card: CardData) => void
): Promise<void> => {
  for (const card of cards) {
    if (card.imagePrompt) {
      const imageUrl = await generateImageForPrompt(card.imagePrompt);
      onCardUpdate({ ...card, imageUrl });
    }
  }
};
