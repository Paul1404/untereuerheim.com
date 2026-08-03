import { timingSafeEqual } from "node:crypto";

export const ORIGIN_AUTH_HEADER = "x-origin-verify";

export const isOriginAuthorized = (
  request: Request,
  pathname: string,
  secret = process.env.ORIGIN_AUTH_SECRET?.trim(),
): boolean => {
  if (pathname === "/health.json" || !secret) return true;

  const candidate = request.headers.get(ORIGIN_AUTH_HEADER);
  if (!candidate) return false;

  const expectedBytes = Buffer.from(secret);
  const candidateBytes = Buffer.from(candidate);
  return candidateBytes.length === expectedBytes.length && timingSafeEqual(candidateBytes, expectedBytes);
};
