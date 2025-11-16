import { AIStyle } from './types';

export const AI_STYLE_PROMPTS: Record<AIStyle, string> = {
  [AIStyle.WATERCOLOR]: 'Transform this photo into a whimsical and soft watercolor painting. Keep the facial features and likeness of the people clear and recognizable.',
  [AIStyle.TWINKLE_STAR]: "Expertly replace the background of this photo with a dreamy 'Twinkle Twinkle Little Star' themed night sky. The background should feature soft, fluffy clouds and gentle, glowing stars, creating a whimsical and serene nursery atmosphere. Keep the subjects in the foreground completely unchanged, ensuring they are cleanly cut out and naturally integrated into the new scene.",
  [AIStyle.BOSTON_WATERCOLOR]: "Transform this photo by replacing the background with a beautiful watercolor painting of the Boston skyline, featuring iconic landmarks like Fenway Park, the Citgo sign, and university campuses. The watercolor style should be soft and artistic. Keep the subjects in the foreground clear, recognizable, and seamlessly blended with the new background. Add the text 'Boston Baby' prominently at the top in a playful script font that fits the scene.",
  [AIStyle.CARICATURE]: "Turn this photo into a lively streetside caricature, like those drawn by artists in public squares. Exaggerate facial features playfully while preserving likeness. Use bold, sketchy ink lines with vibrant marker-style shading. Keep a clean white or lightly textured paper background, and include a subtle artist signature-style flourish in the corner.",
  [AIStyle.PENCIL_SKETCH]: "Convert this photo into a detailed and realistic pencil sketch. The sketch should have fine lines, subtle shading, and a hand-drawn feel, while preserving the likeness of the subjects.",
  [AIStyle.CARTOON]: "Turn this photo into a fun, friendly cartoon. The style should be reminiscent of modern animated movies, with simplified features, expressive eyes, and vibrant colors, while keeping the subjects clearly recognizable.",
};

export const GOOGLE_PHOTOS_ALBUM_URL = 'https://photos.app.goo.gl/Az1AYNjNWY8h1LrM8';

// 200x200px PNG sticker of the couple
// The sticker is temporarily disabled until a valid base64 string is provided.
export const COUPLE_STICKER_BASE64 = '';

// Optional: Google Apps Script Web App endpoint to save photos to Google Drive.
// Set this to your deployed Apps Script URL (doPost handler) or leave empty to disable.
export const GDRIVE_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbyYKgSEXitAw1vHjPJsYU_xPMw-9oQy2BeVQ44dSNlyJEJa8U4CSvyMfBnRyd27VF9xDg/exec';

// Optional: Public link to the shared Google Drive folder or gallery site attendees can view.
export const PHOTO_LOG_PUBLIC_URL = 'https://drive.google.com/drive/folders/1DarJll3p6i9iOhEFuI2WSWNcqa9kySqW?usp=sharing';
