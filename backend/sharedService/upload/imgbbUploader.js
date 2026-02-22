// imgbbUploader.js
import axios from "axios";
import compress from "./compress.js";
import handler from "../utils/handler.js";

const IMGBB_API = "https://api.imgbb.com/1/upload";
const API_KEY = process.env.IMGBB_API_KEY;

export const imgbbUploader = handler(async (fileBuffer, fileName = "image") => {
  // Compress and convert to webp before upload
  const compressedBuffer = await compress(fileBuffer);
  // Convert buffer to base64
  const base64 = compressedBuffer.toString("base64");
  const form = new URLSearchParams();
  form.append("key", API_KEY);
  form.append("image", base64);
  form.append("name", fileName.replace(/\.[^.]+$/, ".webp"));
  const response = await axios.post(IMGBB_API, form);
  if (response.data && response.data.data && response.data.data.url) {
    const { url, delete_url, id } = response.data.data;
    return { url, deleteUrl: delete_url, imgbbId: id };
  }
  throw new Error("ImgBB upload failed");
});
