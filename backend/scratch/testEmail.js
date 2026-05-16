import 'dotenv/config';
import { sendOTP } from '../utlis/mail.js';

const testEmail = async () => {
    console.log("Testing Email System...");
    console.log("Using Email:", process.env.EMAIL_USER);
    
    // Yahan apna email bhi daal sakte hain test karne ke liye
    const targetEmail = process.env.EMAIL_USER; 
    const testOTP = "123456";

    const result = await sendOTP(targetEmail, testOTP);

    if (result) {
        console.log("✅ Success! Check your inbox (and Spam folder).");
    } else {
        console.log("❌ Failed! Please check your .env credentials and internet connection.");
    }
    process.exit();
};

testEmail();
