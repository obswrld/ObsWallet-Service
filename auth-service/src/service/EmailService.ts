import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  async sendVerificationEmail(to: string, verificationLink: string) {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "Verify your email",
      html: `<p>Click the link below to verify your email:</p>
              <a href="${verificationLink}">Click here to verify your email</a>`,
    });
  }
}
