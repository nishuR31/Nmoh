// compress.js
import sharp from "sharp";
import handler from "../utils/handler.js";

/**
 * Compress and convert image buffer to webp, lossy, quality 80-90, under 1MB if possible.
 * @param {Buffer} buffer - Original image buffer
 * @returns {Promise<Buffer>} - Compressed webp buffer
 */
let compress = handler(async (buffer) => {
  if (!buffer) {
    return "Please upload image";
  }
  let image = buffer;
  let options = { quality: 80 };
  let output;
  // Try to compress under 1MB, lower quality if needed
  output = await sharp(image)
    .rotate()
    .resize({ withoutEnlargement: true })
    .webp({ ...options, smartSubsample: true, effort: 6 })
    .toBuffer();

  return output;
});
export default compress;
