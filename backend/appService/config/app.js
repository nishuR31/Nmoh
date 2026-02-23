import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import success from "../../sharedService/response/success.js";
import err from "../../sharedService/response/error.js";
import codes from "../../sharedService/utils/codes.js";
import appRouter from "../routes/app.route.js";

const app = express();
const baseRoute = process.env.BASE;
const service = `${baseRoute}/app`;

/* ---------------- SECURITY ---------------- */

app.use((req, _, next) => {
  delete req.headers[`x-user-id`];
  delete req.headers[`x-authenticated`];
  next();
});

app.use(helmet());
app.use(morgan(`dev`));
app.use(express.json({ limit: `50mb` }));
app.use(express.urlencoded({ extended: true, limit: `50mb` }));
app.use(cookieParser());

/* ---------------- CORS ---------------- */

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_PROD,
  process.env.FRONTEND_URL_DEV,
  `http://localhost:5173`,
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

      cb(new Error(`CORS blocked`));
    },
    credentials: true,
    methods: [`GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `OPTIONS`],
    allowedHeaders: [`Content-Type`, `Authorization`, `x-user-id`, `x-authenticated`],
    exposedHeaders: [`Content-Type`, `Authorization`],
    maxAge: 86400,
  }),
);

/* ---------------- RATE LIMIT ---------------- */

app.use(
  rateLimit({
    windowMs: 60_000,
    max: process.env.MODE === `dev` ? 10000 : 120,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path.startsWith(`/ping`), // don't block health checks
  }),
);

/* ---------------- LOCAL ROUTES ---------------- */

app.use(service, appRouter);

app.get(`/`, (_, res) =>
  success(res, `${api(service)}`, codes.ok, { msg: `Hello from ${api(service)} service` }),
);

app.get(`${service}`, (_, res) =>
  success(res, `${api(service)}route fetched`, codes.ok, {
    msg: `Hello from ${api(service)} route`,
  }),
);

app.all(`${service}/{*spalt}`, (req, res) =>
  err(res, `Route not found`, codes.notFound, { path: req.url }),
);
/* ---------------- 404 ---------------- */

app.use((req, res) => err(res, `Route not found`, codes.notFound, { path: req.originalUrl }));

app.use((err, req, res, next) => {
  // If error has statusCode, use it; else default to 400 for validation, 401 for auth
  const status =
    err.statusCode || (err.message && /invalid|expired|not found/i.test(err.message) ? 400 : 401);
  res.status(status).json({
    message: err.message || `Something went wrong`,
    statusCode: status,
    success: false,
    stack: process.env.MODE === `dev` ? err.stack : undefined,
  });
});

export default app;
