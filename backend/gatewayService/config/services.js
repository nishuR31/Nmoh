export default {
  "/api/v1/app":
    process.env.MODE === "dev" ? `http://localhost:${process.env.APP_PORT}` : process.env.APP_HOST,
  "/api/v1/auth":
    process.env.MODE === "dev"
      ? `http://localhost:${process.env.AUTH_HOST}`
      : process.env.AUTH_HOST,
  "/api/v1/data":
    process.env.MODE === "dev"
      ? `http://localhost:${process.env.DATA_HOST}`
      : process.env.DATA_HOST,
};
