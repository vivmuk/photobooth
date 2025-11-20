import { GoogleGenAI, Modality } from "@google/genai";

const getAIClient = () => {
  // In a real deployment, ensure process.env.API_KEY is set.
  // The UI for Veo checks for user-selected keys in the preview environment.
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Generates a stylized image based on an input photo and a prompt.
 */
export const generateStyledImage = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = getAIClient();
  
  // Strip prefix if present (e.g., "data:image/jpeg;base64,")
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Extract image
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts && parts.length > 0) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image data received from Gemini.");
  } catch (error) {
    console.error("Error generating styled image:", error);
    throw error;
  }
};

/**
 * Generates a video using Veo based on an input photo and a prompt.
 */
export const generateVeoVideo = async (
  base64Image: string, 
  prompt: string
): Promise<string> => {
  const ai = getAIClient();
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

  try {
    // Initial Generation Request
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || "Animate this image naturally.",
      image: {
        imageBytes: cleanBase64,
        mimeType: 'image/jpeg',
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p', // Fast preview supports 720p
        aspectRatio: '9:16', // Portrait for mobile photo booth feel
      }
    });

    // Polling Loop
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
      console.log("Polling Veo operation...");
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    // Check for success
    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) {
      throw new Error("Video generation completed but no URI returned.");
    }

    // Fetch the actual video blob using the key
    // Note: In a production proxy, you wouldn't expose the key in the URL like this, 
    // but for this client-side SDK usage, it's the standard pattern.
    const fetchResponse = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
    if (!fetchResponse.ok) {
       throw new Error(`Failed to fetch video file: ${fetchResponse.statusText}`);
    }
    
    const blob = await fetchResponse.blob();
    return URL.createObjectURL(blob);

  } catch (error) {
    console.error("Error generating Veo video:", error);
    throw error;
  }
};

/**
 * Checks if the user needs to select an API key (specifically for AI Studio preview context).
 */
export const checkAndRequestApiKey = async (): Promise<boolean> => {
  if (typeof window.aistudio !== 'undefined') {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      return false;
    }
  }
  // If aistudio object isn't there, we assume env var is set or handled elsewhere
  return true;
};

export const openApiKeySelection = async () => {
  if (typeof window.aistudio !== 'undefined') {
    await window.aistudio.openSelectKey();
  }
};
