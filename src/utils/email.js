import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// --- Transporter Setup ---
let transporter;

// If in development, fake transporter (console log only)
if (process.env.NODE_ENV === 'development') {
  transporter = {
    sendMail: async (mailOptions) => {
      console.log('📧 Simulated Email Sent:');
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('HTML:', mailOptions.html);
      return { accepted: [mailOptions.to], messageId: 'simulated-dev-id' };
    }
  };
} else {
  // Real transporter for production
  transporter = nodemailer.createTransport({
    host: process.env.ZOHO_HOST,
    port: process.env.ZOHO_PORT,
    secure: true, // true for 465
    auth: {
      user: process.env.ZOHO_USER,
      pass: process.env.ZOHO_PASS,
    },
  });
}

// --- Generic Email Sender ---
export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"TechHub" <${process.env.ZOHO_USER}>`,
    to,
    subject,
    html,
  };
  return transporter.sendMail(mailOptions);
};

// --- Templates ---
export const passwordResetOtpTemplate = (name, otp) => `
  <div style="font-family: Poppins, sans-serif; background:#f8f9fa; padding:20px;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:8px; padding:20px; border:1px solid #eee;">
      <h2 style="color:#105341;">Password Reset Request</h2>
      <p>Hi ${name},</p>
      <p>You requested to reset your password. Use the OTP below to proceed:</p>
      <div style="background:#defeab; color:#105341; font-size:24px; font-weight:bold; padding:10px; text-align:center; border-radius:6px; letter-spacing:3px;">
        ${otp}
      </div>
      <p style="margin-top:20px;">This OTP is valid for 10 minutes. If you didn’t request this, please ignore this email.</p>
      <p style="color:#212529;">– TechHub Team</p>
    </div>
  </div>
`;

export const passwordResetSuccessTemplate = (name) => `
  <div style="font-family:Poppins, sans-serif; background:#f8f9fa; padding:20px;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:8px; padding:20px; border:1px solid #eee;">
      <h2 style="color:#105341;">Password Reset Successful</h2>
      <p>Hi ${name},</p>
      <p>Your password has been reset successfully. If this wasn’t you, please contact support immediately.</p>
      <p style="color:#212529;">– TechHub Team</p>
    </div>
  </div>
`;

export const passwordChangedTemplate = (name) => `
  <div style="font-family:Poppins, sans-serif; background:#f8f9fa; padding:20px;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:8px; padding:20px; border:1px solid #eee;">
      <h2 style="color:#105341;">Password Changed</h2>
      <p>Hi ${name},</p>
      <p>Your password was changed successfully. If this wasn’t you, please <a href="#">reset it immediately</a>.</p>
      <p style="color:#212529;">– TechHub Team</p>
    </div>
  </div>
`;


// --- Contact Message Template (New) ---
export const contactNotificationTemplate = (userName, userEmail, message) => `
  <div style="font-family:Poppins, sans-serif; background:#f8f9fa; padding:20px;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:8px; padding:20px; border:1px solid #eee;">
      <h2 style="color:#105341;">New Contact Message Received</h2>
      <p>Dear Admin,</p>
      <p>A user has just submitted a contact message via your website:</p>
      <div style="background:#f0fdf4; border-left:4px solid #105341; padding:10px 15px; border-radius:6px;">
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-line;">${message}</p>
      </div>
      <p style="margin-top:20px;">Kindly follow up with the user as needed.</p>
      <p style="color:#212529;">– TechHub Bot</p>
    </div>
  </div>
`;

// --- Contact Notification Sender (New) ---
export const sendContactNotification = async ({ userName, userEmail, message }) => {
  const html = contactNotificationTemplate(userName, userEmail, message);
  return sendEmail({
    to: process.env.USER_ADMIN_EMAIL, // admin email in .env
    subject: `📨 New Contact Message from ${userName}`,
    html,
  });
};