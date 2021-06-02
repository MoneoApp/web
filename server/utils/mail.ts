import { createTransport } from 'nodemailer';

type Config = {
  to: string | string[],
  subject: string,
  html: string
}

export async function mail({to, subject, html }: Config) {
  const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  });

  await transporter.sendMail({
    from: `"Moneo App" <${process.env.SMTP_USERNAME}>`,
    to,
    subject,
    html
  });
}
