const nodemailer = require('nodemailer');

// À adapter avec vos infos SMTP réelles
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp-fr.securemail.pro',
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
  secure: true, // SSL/TLS
  auth: {
    user: process.env.SMTP_USER || process.env.MAIL_USER,
    pass: process.env.SMTP_PASS || process.env.MAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function sendGoalProgressMail(to, subject, text, html) {
  // Permet de passer un HTML custom (pour reset password)
  let htmlContent = html;
  if (!htmlContent) {
    htmlContent = `
      <div style="max-width:500px;margin:0 auto;background:#f9f9f9;border-radius:10px;padding:32px 24px 24px 24px;font-family:sans-serif;box-shadow:0 2px 8px #0001;">
        <h2 style="color:#2e7d32;text-align:center;margin-top:0;">${subject}</h2>
        <p style="font-size:1.1em;color:#333;line-height:1.6;text-align:center;">${text.replace(/\n/g, '<br>')}</p>
        <div style="margin-top:32px;text-align:center;">
          <a href="https://gestion-argent.theobelland.fr" style="display:inline-block;padding:10px 24px;background:#2e7d32;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">Accéder à mon tableau de bord</a>
        </div>
        <p style="font-size:0.9em;color:#888;text-align:center;margin-top:32px;">Cet email vous est envoyé automatiquement par Gestion de l'Argent.</p>
      </div>
    `;
  }
  const mailOptions = {
    from: process.env.SMTP_USER || process.env.MAIL_USER || 'noreply@theobelland.fr',
    to,
    subject,
    text,
    html: htmlContent
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Mail envoyé à', to, 'sujet:', subject, 'info:', info);
    return info;
  } catch (err) {
    console.error('Erreur envoi mail à', to, 'sujet:', subject, err);
    throw err;
  }
}

module.exports = { sendGoalProgressMail };
