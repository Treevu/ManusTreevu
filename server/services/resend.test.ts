import { describe, expect, it } from "vitest";

describe("Resend API Key Validation", () => {
  it("should validate RESEND_API_KEY format if set", () => {
    const apiKey = process.env.RESEND_API_KEY;
    
    // Skip validation if not set (optional in dev environment)
    if (!apiKey) {
      console.log("RESEND_API_KEY not set - skipping format validation");
      expect(true).toBe(true); // Pass test
      return;
    }
    
    expect(apiKey).not.toBe("");
    expect(apiKey.startsWith("re_")).toBe(true);
  });

  it("should be able to initialize Resend client when API key is set", async () => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.log("Skipping test: RESEND_API_KEY not set");
      expect(true).toBe(true);
      return;
    }
    
    // Dynamic import to avoid issues if Resend is not installed
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    
    expect(resend).toBeDefined();
  });
});
