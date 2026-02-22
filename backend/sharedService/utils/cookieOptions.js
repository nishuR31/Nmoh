export default function cookieOptions(mode = "access") {
  const isDev = process.env.MODE === "dev";

  const base = {
    httpOnly: true,
    path: "/",
    secure: !isDev, // false in dev, true in prod
    sameSite: isDev ? "lax" : "none", // lax for localhost, none for cross-site prod
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  if (mode.toLowerCase() === "access") {
    return base;
  }

  return {
    ...base,
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  };
}
