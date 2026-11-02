import crypto from "crypto";

function signToken(token: string): string {
  const secret = process.env.ADMIN_PASSWORD!;
  return crypto.createHmac("sha256", secret).update(token).digest("hex");
}

export function makeSessionCookieValue(): string {
  const token = crypto.randomBytes(32).toString("hex");
  return `${token}.${signToken(token)}`;
}

export function isValidSession(cookieValue: string | undefined): boolean {
  if (!cookieValue || !cookieValue.includes(".")) return false;
  const dot = cookieValue.lastIndexOf(".");
  const token = cookieValue.slice(0, dot);
  const sig = cookieValue.slice(dot + 1);
  if (!token || !sig || sig.length !== 64) return false;

  const expected = signToken(token);
  return crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
}
