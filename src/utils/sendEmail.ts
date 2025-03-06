import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail(
  to: string,
  subject: string,
  text: string
) {
  await resend.emails.send({
    from: "SyntaxX <noreply@email.v1pinx.tech>",
    to,
    subject,
    text,
  });
}
