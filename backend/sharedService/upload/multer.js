// upload.js
import multer from "multer";

export const multerInstance = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 32 * 1024 * 1024, // 32MB
  },
});
