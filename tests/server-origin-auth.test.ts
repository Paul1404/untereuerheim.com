import { describe, expect, test } from "bun:test";
import { ORIGIN_AUTH_HEADER, isOriginAuthorized } from "../server-origin-auth";

describe("origin authentication", () => {
  const secret = "cloudfront-origin-secret";

  test("allows deployments without an enabled secret", () => {
    expect(isOriginAuthorized(new Request("https://origin.example/"), "/", undefined)).toBe(true);
  });

  test("keeps the Railway health check available", () => {
    expect(isOriginAuthorized(new Request("https://origin.example/health.json"), "/health.json", secret)).toBe(true);
  });

  test("rejects missing and incorrect origin headers", () => {
    expect(isOriginAuthorized(new Request("https://origin.example/"), "/", secret)).toBe(false);
    expect(
      isOriginAuthorized(
        new Request("https://origin.example/", { headers: { [ORIGIN_AUTH_HEADER]: "wrong" } }),
        "/",
        secret,
      ),
    ).toBe(false);
  });

  test("accepts the exact CloudFront origin header", () => {
    expect(
      isOriginAuthorized(
        new Request("https://origin.example/", { headers: { [ORIGIN_AUTH_HEADER]: secret } }),
        "/",
        secret,
      ),
    ).toBe(true);
  });
});
