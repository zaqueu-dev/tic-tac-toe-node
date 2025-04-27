import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import sharp from "sharp";
import fse from "fs-extra";

// Get __dirname in ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Process a game image and save it to a folder.
 * Returns an object with the original image path and the content
 * in Base64.
 * @param {string} imagePath - Path to the image to process
 * @param {string} gameId - Game ID (used to create a unique name)
 * @returns {Promise<{originalPath: string, base64: string}>}
 */
export async function processGameImage(imagePath, gameId) {
  try {
    // Create the directory if it doesn't exist
    const outputDir = path.join(__dirname, "../../public");
    await fse.ensureDir(outputDir);

    // Generate a unique name with timestamp to avoid conflicts
    const ext = path.extname(imagePath);
    const filename = `game_${gameId}${ext}`;
    const destPath = path.join(outputDir, filename);

    // Copy the image
    await fse.copy(imagePath, destPath);

    // Read the image and convert to Base64
    const imageBuffer = await fs.readFile(destPath);
    const base64String = imageBuffer.toString("base64");
    const mimeType = getMimeType(ext);

    return {
      originalPath: destPath,
      base64: `data:${mimeType};base64,${base64String}`,
    };
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
}

/**
 * Get the correct MIME type for the file extension
 * @param {string} ext - File extension (.jpg, .png, etc.)
 * @returns {string}
 */
function getMimeType(ext) {
  const types = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };
  return types[ext.toLowerCase()] || "application/octet-stream";
}
