
import { AIStyle } from '../types';
import { AI_STYLE_PROMPTS } from '../constants';

const VENICE_API_KEY = 'lnWNeSg0pA_rQUooNpbfpPDBaj2vJnWol5WqKWrIEF';
const VENICE_API_URL = 'https://api.venice.ai/api/v1/image/edit';

function dataUrlToBlob(dataUrl: string): { base64: string; mimeType: string } {
    const parts = dataUrl.split(',');
    const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const base64 = parts[1];
    return { base64, mimeType };
}

/**
 * Converts binary image data to a data URL
 */
function binaryToDataUrl(binaryData: ArrayBuffer, mimeType: string = 'image/png'): string {
    const bytes = new Uint8Array(binaryData);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    return `data:${mimeType};base64,${base64}`;
}

export const applyAIStyle = async (base64ImageDataUrl: string, style: AIStyle): Promise<string> => {
    try {
        const { base64 } = dataUrlToBlob(base64ImageDataUrl);
        const prompt = AI_STYLE_PROMPTS[style];

        const response = await fetch(VENICE_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${VENICE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                image: base64,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Venice API error: ${response.status} - ${errorText}`);
        }

        // Venice API returns binary PNG data
        const imageBlob = await response.blob();
        const arrayBuffer = await imageBlob.arrayBuffer();
        
        // Convert binary data to data URL
        return binaryToDataUrl(arrayBuffer, 'image/png');

    } catch (error) {
        console.error("Error applying AI style:", error);
        throw error;
    }
};
