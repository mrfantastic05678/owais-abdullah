import { Resend } from "resend";

// Lazy init — never instantiate at module load (breaks next build when key is absent).
let _resend: Resend | undefined;
export const getResend = () =>
  (_resend ??= new Resend(process.env.RESEND_API_KEY ?? "not-configured"));

export const FROM_ADDRESS =
  process.env.RESEND_FROM_EMAIL ?? "Owais Abdullah <onboarding@resend.dev>";
export const TO_ADDRESS =
  process.env.CONTACT_TO_EMAIL ?? "mrowaisabdullah@gmail.com";
