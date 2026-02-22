export default function isPublic(path) {
  return (
    path.endsWith("/ping") ||
    path.endsWith("/fetch") ||
    path.endsWith("/mail") ||
    path.endsWith("/carousel") ||
    path.endsWith("/snapshots") ||
    path.endsWith("/status") ||
    path.endsWith("/forgot") ||
    path.endsWith("/reset-password") ||
    path.includes("/ping") ||
    path.includes("/fetch") ||
    path.includes("/mail") ||
    path.includes("/carousel") ||
    path.includes("/check-otp") ||
    path.includes("/forgot") ||
    path.includes("/reset-password") ||
    path.includes("/snapshots") ||
    path.includes("/store/status") ||
    (path.includes("/app") && path.includes("/carousel"))
  );
}

export function isUnauthenticatedRoute(path) {
  // Routes that don't require an existing token (login, register, forgot password, etc)
  // but may require validation at the service level
  return (
    path.endsWith("/login") ||
    path.endsWith("/register") ||
    path.endsWith("/forgot") ||
    path.endsWith("/logout") ||
    path.endsWith("/passless") ||
    path.includes("/login") ||
    path.includes("/register") ||
    path.includes("/forgot") ||
    path.includes("/logout") ||
    path.includes("/auth/passless")
  );
}
