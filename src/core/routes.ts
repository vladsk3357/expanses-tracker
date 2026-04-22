/** Path prefixes that require an authenticated Supabase session (middleware). */
export const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/receipts",
  "/statistics",
] as const;

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
