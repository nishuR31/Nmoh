import express from "express";
import cors from "cors";

import success from "../../sharedService/response/success.js";
import err from "../../sharedService/response/error.js";
import codes from "../../sharedService/utils/codes.js";
// import dataRouter from "../routes/event.route.js";

const baseRoute = process.env.BASE;
const service = `${baseRoute}/data`;
const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_PROD,
  process.env.FRONTEND_URL_DEV,
  "http://localhost:5173",
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

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// app.use(service, dataRouter);

app.get("/", (req, res) =>
  success(res, "Root route", codes.ok, {
    msg: "Hello from data service",
  }),
);

app.get(`${service}`, (req, res) =>
  success(res, `${service} route fetched`, codes.ok, {
    msg: "Hello from data route",
  }),
);

app.all(`${service}/{*spalt}`, (req, res) =>
  err(res, "Route not found", codes.notFound, { path: req.url }),
);

app.use((req, res) => err(res, "Route not found", codes.notFound, { path: req.originalUrl }));

export default app;
