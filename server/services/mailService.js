import nodemailer from 'nodemailer';

const getTransporter = () => {
  const host = process.env.ZOHO_SMTP_HOST || 'smtp.zoho.in';
  const port = parseInt(process.env.ZOHO_SMTP_PORT || '465', 10);
  const user = process.env.ZOHO_EMAIL || 'enquiry@murtihub.co.in';
  const pass = process.env.ZOHO_APP_PASSWORD || '';

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false, // Prevents self-signed cert issues
    },
  });
};

export const verifyMailConnection = async () => {
  const pass = process.env.ZOHO_APP_PASSWORD;
  if (!pass || pass === 'your_app_password') {
    console.log('[Zoho Mail] Notice: ZOHO_APP_PASSWORD is set to placeholder. Please provide your real Zoho App Password in .env to send live emails.');
    return false;
  }

  try {
    const transporter = getTransporter();
    await transporter.verify();
    console.log('[Zoho Mail] Transporter connected successfully to', process.env.ZOHO_SMTP_HOST);
    return true;
  } catch (err) {
    console.warn('[Zoho Mail] Transporter verification note:', err.message);
    return false;
  }
};

export const sendContactNotification = async (submission) => {
  const recipient = process.env.ZOHO_EMAIL || 'enquiry@murtihub.co.in';
  const pass = process.env.ZOHO_APP_PASSWORD;

  if (!pass || pass === 'your_app_password') {
    console.log('[Zoho Mail] Submission received & saved to DB. Email dispatch skipped: ZOHO_APP_PASSWORD is not configured.');
    return {
      success: false,
      error: 'Zoho Mail app password is placeholder. Submission saved in MongoDB.',
    };
  }

  try {
    const transporter = getTransporter();
    const mailOptions = {
      from: `"MurtiHub Website" <${recipient}>`,
      to: recipient,
      replyTo: submission.email,
      subject: `[New Inquiry] ${submission.name} — ${submission.projectType || 'General Consultation'}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #0c121e; color: #f0f4fc; padding: 32px; border-radius: 8px;">
          <div style="border-bottom: 2px solid #38bdf8; padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="color: #38bdf8; margin: 0; font-size: 24px; letter-spacing: 0.5px;">MurtiHub Technologies</h2>
            <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 14px;">Inbound Consultation Inquiry Notification</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 10px 0; color: #94a3b8; width: 140px; font-weight: 600;">Full Name:</td>
              <td style="padding: 10px 0; color: #ffffff; font-weight: bold;">${submission.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #94a3b8; font-weight: 600;">Email Address:</td>
              <td style="padding: 10px 0; color: #38bdf8;"><a href="mailto:${submission.email}" style="color: #38bdf8; text-decoration: none;">${submission.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #94a3b8; font-weight: 600;">Organization:</td>
              <td style="padding: 10px 0; color: #ffffff;">${submission.company || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #94a3b8; font-weight: 600;">Service Required:</td>
              <td style="padding: 10px 0; color: #38bdf8; font-weight: 600;">${submission.projectType || 'General'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #94a3b8; font-weight: 600;">Date / Time:</td>
              <td style="padding: 10px 0; color: #cbd5e1;">${new Date(submission.createdAt || Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
            </tr>
          </table>

          <div style="background: rgba(255,255,255,0.05); border-left: 4px solid #38bdf8; padding: 18px; border-radius: 4px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Message Details:</p>
            <p style="margin: 0; color: #f8fafc; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${submission.message}</p>
          </div>

          <div style="font-size: 12px; color: #64748b; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;">
            This inquiry was automatically recorded in MongoDB and transmitted to ${recipient}. You can manage all inquiries in your <a href="http://localhost:5173/admin" style="color: #38bdf8;">Admin Portal</a>.
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[Zoho Mail] Email delivered successfully. ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Zoho Mail] Dispatch error:', error.message);
    return { success: false, error: error.message };
  }
};

export const sendPasswordResetOtpEmail = async ({ to, name, otp }) => {
  const sender = process.env.ZOHO_EMAIL || 'enquiry@murtihub.co.in';
  const pass = process.env.ZOHO_APP_PASSWORD;

  console.log(`[Zoho Mail OTP] Active OTP generated for ${to}: [ ${otp} ]`);

  if (!pass || pass === 'your_app_password') {
    console.log(`[Zoho Mail OTP] Notice: ZOHO_APP_PASSWORD is not configured in .env. Password reset code [${otp}] logged in console for administrative verification.`);
    return {
      success: true,
      simulated: true,
      message: `Verification code generated. (Check server logs or email)`,
    };
  }

  try {
    const transporter = getTransporter();
    const mailOptions = {
      from: `"MurtiHub Security" <${sender}>`,
      to,
      subject: `[MurtiHub Security] Your Password Reset Code: ${otp}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #070c18; color: #f1f5f9; padding: 40px 20px; text-align: center;">
          <div style="max-width: 520px; margin: 0 auto; background: #0f172a; border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 12px; padding: 36px 28px; text-align: left; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div style="border-bottom: 1px solid rgba(56, 189, 248, 0.2); padding-bottom: 20px; margin-bottom: 24px; text-align: center;">
              <h2 style="color: #38bdf8; margin: 0 0 6px 0; font-size: 22px; letter-spacing: 0.5px;">MurtiHub Technologies</h2>
              <span style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Institutional Administrative Access</span>
            </div>

            <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6; margin-bottom: 12px;">
              Hello <strong>${name || 'Administrator'}</strong>,
            </p>
            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
              We received a request to reset the administrative password for your account (<code>${to}</code>). Use the verification code below to authorize your password update:
            </p>

            <div style="text-align: center; margin: 32px 0;">
              <div style="display: inline-block; background: #0369a1; border: 2px solid #38bdf8; color: #ffffff; letter-spacing: 10px; font-size: 32px; font-weight: 800; font-family: 'Courier New', Courier, monospace; padding: 16px 24px 16px 34px; border-radius: 8px; box-shadow: 0 0 25px rgba(56, 189, 248, 0.3);">
                ${otp}
              </div>
              <p style="color: #38bdf8; font-size: 12px; margin-top: 12px; font-weight: 600;">
                Valid for 15 minutes
              </p>
            </div>

            <div style="background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
              <p style="margin: 0; color: #fca5a5; font-size: 12.5px; line-height: 1.5;">
                <strong>Security Alert:</strong> If you did not initiate this request, please disregard this message or alert the super administrator. MurtiHub engineering will never ask for your code.
              </p>
            </div>

            <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; font-size: 12px; color: #64748b; text-align: center;">
              © ${new Date().getFullYear()} MurtiHub Technologies. Sovereign Software Architecture.
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[Zoho Mail OTP] Email delivered successfully. ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Zoho Mail OTP] Dispatch error:', error.message);
    return { success: false, error: error.message };
  }
};

