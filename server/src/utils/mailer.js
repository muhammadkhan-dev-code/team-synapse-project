const nodemailer = require('nodemailer');
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NODE_ENV } = require('../config/env');

/**
 * Creates a Nodemailer transporter.
 * In development without SMTP credentials, falls back to Ethereal (fake SMTP).
 * In production, real SMTP credentials are required.
 */
const createTransporter = async () => {
  if (NODE_ENV === 'production' || (SMTP_HOST && SMTP_USER && SMTP_PASS)) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  // Development fallback: Ethereal fake SMTP
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  return transporter;
};

/**
 * Sends an OTP verification email to the user.
 * @param {string} to - Recipient email address
 * @param {string} otp  - 6-digit OTP code
 */
const sendOtpEmail = async (to, otp) => {
  const transporter = await createTransporter();

  const info = await transporter.sendMail({
    from: `"UniRideSync" <${SMTP_USER || 'no-reply@uniridesync.dev'}>`,
    to,
    subject: 'Verify your UniRideSync account',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
        <h2 style="color:#1F3864;">UniRideSync — Email Verification</h2>
        <p>Your one-time verification code is:</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#2E5AA8;text-align:center;padding:16px 0;">
          ${otp}
        </div>
        <p style="color:#555;">This code expires in <strong>24 hours</strong>. Do not share it with anyone.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
        <p style="font-size:12px;color:#999;">If you did not register on UniRideSync, please ignore this email.</p>
      </div>
    `,
  });

  // In development, log the preview URL so you can check the email without a real inbox
  if (NODE_ENV !== 'production') {
    console.log(`[Mailer] OTP sent to ${to}. Preview: ${nodemailer.getTestMessageUrl(info)}`);
  }
};

/**
 * Sends a generic notification email (ride request events).
 * Used by the Requests module for FR-4.2 / FR-4.5 notifications.
 * @param {string} to        - Recipient email address
 * @param {string} subject   - Email subject line
 * @param {string} bodyHtml  - HTML body content
 */
const sendNotificationEmail = async (to, subject, bodyHtml) => {
  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail({
      from: `"UniRideSync" <${SMTP_USER || 'no-reply@uniridesync.dev'}>`,
      to,
      subject,
      html: bodyHtml,
    });
    if (NODE_ENV !== 'production') {
      console.log(`[Mailer] Notification sent to ${to}. Preview: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (err) {
    // Notification failures are non-fatal — log and continue
    console.error('[Mailer] Failed to send notification email:', err.message);
  }
};

module.exports = { sendOtpEmail, sendNotificationEmail };
