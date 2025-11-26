const router = require("express").Router();
const nodemailer = require("nodemailer");

const SUPPORT_EMAIL = "support@buniquesense.com";

// GMAIL TRANSPORTER (app password required)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,     // your Gmail
    pass: process.env.MAIL_PASS      // 16-digit App Password
  }
});

// --------------------------
// HOME PAGE CONTACT FORM
// --------------------------
router.post("/home", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // EMAIL TO SUPPORT
    await transporter.sendMail({
      from: `"Website Message" <${process.env.MAIL_USER}>`,
      to: SUPPORT_EMAIL,
      subject: "Message From Customer - Home Page",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    });

    // AUTO-REPLY TO CUSTOMER
    await transporter.sendMail({
      from: `"B Unique Sense" <${SUPPORT_EMAIL}>`,
      to: email,
      subject: "Thank you for contacting us!",
      html: `
        <h3>Hi ${name},</h3>
        <p>Thank you for reaching out to us. 🙏</p>
        <p>We have received your message and our team will get back to you within 24–48 hours.</p>
        <br>
        <p>Warm regards,<br><strong>B Unique Sense Team</strong></p>
      `
    });

    res.json({ success: true, message: "Message sent successfully!" });

  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --------------------------
// CONTACT-US PAGE
// --------------------------
router.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // ADMIN EMAIL
    await transporter.sendMail({
      from: `"Website Contact" <${process.env.MAIL_USER}>`,
      to: SUPPORT_EMAIL,
      subject: subject || "Customer Inquiry",
      html: `
        <h2>Contact Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    });

    // AUTO-REPLY
    await transporter.sendMail({
      from: `"B Unique Sense" <${SUPPORT_EMAIL}>`,
      to: email,
      subject: "Thank you for contacting us!",
      html: `
        <h3>Hi ${name},</h3>
        <p>Thank you for reaching out to us! We truly appreciate your interest.</p>
        <p>Our team will respond within 24–48 hours.</p>
        <p>Meanwhile, feel free to explore more about our Bhagavad Gita Writing Program.</p>
        <br>
        <p>Warm regards,<br><strong>B Unique Sense Team</strong></p>
      `
    });

    res.json({ success: true });

  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
