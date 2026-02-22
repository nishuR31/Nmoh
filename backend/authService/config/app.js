import express from "express";
import cors from "cors";

import success from "../../sharedService/response/success.js";
import err from "../../sharedService/response/error.js";
import codes from "../../sharedService/utils/codes.js";
import authRouter from "../routes/auth.route.js";
import api from "../../sharedService/utils/api.js";

const baseRoute = process.env.BASE;
const service = `${baseRoute}/auth`;

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_PROD,
  process.env.FRONTEND_URL_DEV,
  "http://localhost:5173",
  true,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /^https?:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(origin)
      )
        return cb(null, true);
      cb(new Error("CORS blocked"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-user-id", "x-authenticated"],
    exposedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  }),
);

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(service, authRouter);

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error(`${api(service)}  Service Error:${error}`);

  const status = error.status || 500;
  const message = error.message || "Internal Api Server Error";

  return err(res, message, status, {
    error: process.env.MODE === "dev" ? error.message : undefined,
    stack: process.env.MODE === "dev" ? error.stack : undefined,
  });
});

app.get("/", (req, res) =>
  success(res, `Root ${api(service)}  route`, codes.ok, {
    msg: `Hello from ${api(service)}  service`,
  }),
);

app.get(`${service}/`, (req, res) =>
  success(res, `${api(service)} route fetched`, codes.ok, {
    msg: `Hello from ${api(service)} route`,
  }),
);

app.all(`${service}/{*spalt}`, (req, res) =>
  err(res, "Route not found", codes.notFound, { path: req.url }),
);

app.use((req, res) => err(res, "Route not found", codes.notFound, { path: req.originalUrl }));

export default app;
