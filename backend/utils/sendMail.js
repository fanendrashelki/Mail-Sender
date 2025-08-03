const nodemailer = require("nodemailer");

const sendMail = async (email, id) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
  });

  // Tracking Pixel URL
  const trackingUrl = `http://localhost:5000/api/mails/track?id=${id}`;

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Your Custom Mail",
    html: `
    <p>Hello, this is an automated mail.</p>
    <p>Thank you!</p>
    <img src="${trackingUrl}" width="1" height="1" style="display:none;" alt="tracker"/>
  `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
