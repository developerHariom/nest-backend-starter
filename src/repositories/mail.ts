import nodemailer from "nodemailer";

import config from "@/utils/config";

export const sendMail = async (options: any) => {
  const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    service: config.SMTP_SERVICE,
    auth: {
      user: config.SMTP_MAIL,
      pass: config.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: config.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};
