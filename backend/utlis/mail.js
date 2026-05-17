import nodemailer from 'nodemailer';

let transporter = null;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", // You can use Gmail or any other SMTP service
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS, // Your email app password
            },
        });
    }
    return transporter;
};

export const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Email Verification OTP",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                <h2 style="color: #4CAF50; text-align: center;">Verify Your Email</h2>
                <p>Hello,</p>
                <p>Thank you for signing up. Please use the following One-Time Password (OTP) to verify your email address:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 24px; font-weight: bold; background: #f4f4f4; padding: 10px 20px; border-radius: 5px; letter-spacing: 5px;">${otp}</span>
                </div>
                <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2026 Expense Tracker. All rights reserved.</p>
            </div>
        `,
    };

    try {
        const activeTransporter = getTransporter();
        await activeTransporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};
