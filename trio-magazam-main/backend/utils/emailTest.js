import nodemailer from "nodemailer";

const testEmail = async () => {
    try {
        const transport = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const info = await transport.sendMail({
            from: `${process.env.SMTP_FROM_EMAIL} <${process.env.SMTP_FROM_NAME}>`,
            to: "your-email@example.com", // Test üçün e-poçt adresi
            subject: "SMTP Test",
            text: "SMTP konfiqurasiyası işləyir.",
        });

        console.log("Email uğurla göndərildi:", info);
    } catch (error) {
        console.error("Email göndərilərkən xəta baş verdi:", error);
    }
};

testEmail();
