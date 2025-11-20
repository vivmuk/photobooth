import { AIStyle } from './types';

export const AI_STYLE_PROMPTS: Record<AIStyle, string> = {
  [AIStyle.WATERCOLOR]: 'Transform this photo into a whimsical and soft watercolor painting. Keep the facial features and likeness of the people clear and recognizable.',
  [AIStyle.TWINKLE_STAR]: "Expertly replace the background of this photo with a dreamy 'Twinkle Twinkle Little Star' themed night sky. The background should feature soft, fluffy clouds and gentle, glowing stars, creating a whimsical and serene nursery atmosphere. Keep the subjects in the foreground completely unchanged, ensuring they are cleanly cut out and naturally integrated into the new scene.",
  [AIStyle.BOSTON_WATERCOLOR]: "Transform this photo by replacing the background with a beautiful watercolor painting of the Boston skyline, featuring iconic landmarks like Fenway Park, the Citgo sign, and university campuses. The watercolor style should be soft and artistic. Keep the subjects in the foreground clear, recognizable, and seamlessly blended with the new background. Add the text 'Boston Baby' prominently at the top in a playful script font that fits the scene.",
  [AIStyle.CARICATURE]: "Turn this photo into a lively, happy streetside caricature with big friendly smiles and a joyful vibe. Exaggerate facial features playfully while preserving likeness. Use bold, sketchy ink lines with vibrant, cheerful marker-style shading. Keep a clean white or lightly textured paper background, and include a subtle artist signature-style flourish in the corner.",
  [AIStyle.PENCIL_SKETCH]: "Reimagine this photo in the style of a cozy Studio Ghibli film still. Use soft, painterly shading, warm lighting, and gentle color palettes. Keep faces expressive and kind, backgrounds whimsical and slightly dreamy, and overall mood heartwarming and magical while preserving the subjects' likeness.",
  [AIStyle.CARTOON]: "Turn this photo into a fun, friendly cartoon. The style should be reminiscent of modern animated movies, with simplified features, expressive eyes, and vibrant colors, while keeping the subjects clearly recognizable.",
};

// Secret feature prompt
export const SECRET_TRUMP_PROMPT = "Add Donald Trump to this photo, standing next to the subjects and holding a sign that says 'Make Delaware Great Again' in bold red, white, and blue letters. Make it look natural and integrated into the scene.";

export const GOOGLE_PHOTOS_ALBUM_URL = 'https://photos.app.goo.gl/Az1AYNjNWY8h1LrM8';

// 200x200px PNG sticker of the couple
// The sticker is temporarily disabled until a valid base64 string is provided.
export const COUPLE_STICKER_BASE64 = '';

// Optional: Google Apps Script Web App endpoint to save photos to Google Drive.
// Set this to your deployed Apps Script URL (doPost handler) or leave empty to disable.
export const GDRIVE_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwCy4SM1Y7Gaa3dfCmIcx2ADc0pNiEb5hlbxIuQkE1wv8XsWTqhk5DHkz3qSKA7PKq5NA/exec';

// Optional: Public link to the shared Google Drive folder or gallery site attendees can view.
export const PHOTO_LOG_PUBLIC_URL = 'https://drive.google.com/drive/folders/1DarJll3p6i9iOhEFuI2WSWNcqa9kySqW?usp=sharing';
