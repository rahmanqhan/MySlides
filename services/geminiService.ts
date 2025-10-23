import { GoogleGenAI, Type } from "@google/genai";
import { SlidePrototype } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateOutline = async (topic: string): Promise<string[]> => {
  const prompt = `Create a concise presentation outline for the topic: "${topic}". The outline should be a list of 8-10 key sections or slide titles. Return the result as a JSON array of strings.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        },
      },
    });

    const jsonText = response.text.trim();
    const outline = JSON.parse(jsonText);
    if (Array.isArray(outline) && outline.every(item => typeof item === 'string')) {
      return outline;
    } else {
      throw new Error("Invalid outline format received from API.");
    }
  } catch (error) {
    console.error("Error generating outline:", error);
    throw new Error("Failed to generate outline from Gemini API.");
  }
};

export const generateSlides = async (outline: string[]): Promise<SlidePrototype[]> => {
    const prompt = `Generate presentation content based on the following outline: ${JSON.stringify(outline)}. 
For each outline item, create a slide object. Each object must have:
1. "slideType": Choose the most appropriate semantic type from this list: ['introduction', 'divider', 'main_point', 'quote', 'conclusion']. Use 'divider' for major topic introductions. Use 'quote' if the content is a quotation. Use 'main_point' for standard content slides.
2. "title": The outline item itself.
3. "subtitle": A brief, engaging subtitle. For a 'quote' slideType, this should be the attribution (e.g., "- Author Name").
4. "content": An array of strings. For 'main_point', this should be 3-4 bullet points of normal text. For 'quote', it should be a single string with the full quote. For 'divider', this should be an empty array.
5. "image_prompt": A descriptive prompt for an AI image generator that fits the content. For 'divider', this can be an abstract background concept.

Return the result as a JSON array of these objects. Ensure the first slide is an 'introduction' or 'divider'.`;


  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              slideType: { type: Type.STRING },
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              content: { type: Type.ARRAY, items: { type: Type.STRING } },
              image_prompt: { type: Type.STRING }
            },
            required: ['slideType', 'title', 'subtitle', 'content', 'image_prompt']
          }
        }
      }
    });

    const jsonText = response.text.trim();
    const slides = JSON.parse(jsonText);
    
    if (Array.isArray(slides) && slides.every(s => s.slideType && s.title && s.subtitle && Array.isArray(s.content) && typeof s.image_prompt !== 'undefined')) {
        return slides as SlidePrototype[];
    } else {
        throw new Error("Invalid slide data format received from API.");
    }

  } catch (error) {
    console.error("Error generating slides:", error);
    throw new Error("Failed to generate slides from Gemini API.");
  }
};


export const generateImage = async (prompt: string): Promise<string> => {
    if (!prompt) {
        return Promise.resolve('');
    }
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `${prompt}, minimalist, professional presentation, dark theme, high resolution`,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image from Gemini API.");
    }
}