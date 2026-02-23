import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { createProxyMiddleware } from "http-proxy-middleware";
import services from "./config/services.js";
import gatewayAuth from "./middleware/gatewayAuth.js";
// import authMiddleware from "./middleware/middlewareAuth.js";
import isPublic, { isUnauthenticatedRoute } from "./utils/isPublic.js";
import success from "../sharedService/response/success.js";
import codes from "../sharedService/utils/codes.js";
import err from "../sharedService/response/error.js";

const app = express();
const baseRoute = process.env.BASE;
const service = `${baseRoute}/gateway`;
// Header spoof protection

app.use(helmet());
app.use(morgan("dev", { immediate: true }));
// Don't parse bodies at gateway - let target services handle it
app.use(cookieParser());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_PROD,
  process.env.FRONTEND_URL_DEV,
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-user-id", "x-authenticated"],
    exposedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  }),
);

app.use((req, _, next) => {
  delete req.headers["x-user-id"];
  delete req.headers["x-authenticated"];
  next();
});

app.use(
  rateLimit({
    windowMs: 60_000,
    max: process.env.MODE === "dev" ? 10000 : 300,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path.includes("/ping"), // Don't rate limit ping checks
  }),
);

// Health & root

// Proxy setup
Object.entries(services).forEach(([route, target]) => {
  if (!target) return;

  const proxyMiddleware = createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path) => route + path,
    onProxyReq: (proxyReq, req) => {
      if (req.user) {
        proxyReq.setHeader("x-user-id", req.user.id);
        proxyReq.setHeader("x-authenticated", "true");
      }
    },
    onError: (err, req, res) => {
      res.status(502).json({
        status: "error",
        message: "Bad Gateway",
        service: route,
      });
    },
  });

  app.use(route, (req, res, next) => {
    const isPublicRoute = isPublic(req.path);
    const isUnauthedRoute = isUnauthenticatedRoute(req.path);

    if (isPublicRoute) {
      return proxyMiddleware(req, res, next);
    } else if (isUnauthedRoute) {
      // Don't check for token, let the service handle validation
      return proxyMiddleware(req, res, next);
    } else {
      return gatewayAuth(req, res, (authErr) => {
        if (authErr) return;
        return proxyMiddleware(req, res, next);
      });
    }
  });
});

// 404 handler
app.get("/", (_, res) =>
  success(res, "Root route", codes.ok, { msg: "Hello from gateway service" }),
);

app.get(`${service}/ping`, (_, res) =>
  success(res, "Gateway successfully pinged", codes.ok, "Pong"),
);

app.get(service, (_, res) =>
  success(res, `${service} route fetched`, codes.ok, {
    msg: "Hello from gateway route",
  }),
);

app.all(`${service}/{*spalt}`, (req, res) =>
  err(res, "Route not found", codes.notFound, { path: req.url }),
);
/* ---------------- 404 ---------------- */

app.use((req, res) => err(res, "Route not found", codes.notFound, { path: req.originalUrl }));

export default app;
