const renderTemplate = require('./templateService');
const transporter = require('../config/transporter');

const sendEmail = async (emailData) => {
    try {
        const htmlContent = await renderTemplate({ token: emailData.token });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: emailData.email,
            subject: `Reset Password`,
            html: htmlContent,
        });

        console.log("✅ Email sent to:", emailData.email);
    } catch (error) {
        console.error("❌ Email sending failed:", error);
        throw error; // Ensure proper error handling
    }
};

module.exports = sendEmail;