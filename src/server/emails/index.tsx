import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { env } from "~/env";
import PasswordResetEmail from "./components/password-reset"
import EmailVerificationEmail from "./components/email-verification";
import ContactEmail from "./components/contact";

// Ignore self-signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const transporter = nodemailer.createTransport({
    host: env.EMAIL_SERVER,
    port: parseInt(env.EMAIL_PORT),
    secure: env.EMAIL_PORT === "465",
    auth: {
        user: env.EMAIL_USERNAME,
        pass: env.EMAIL_PASSWORD,
    },
});

export const sendPasswordResetEmail = async (
    user: { name: string; email: string },
    resetLink: string,
) => {
    const htmlContent = await render(<PasswordResetEmail user={user} resetLink={resetLink} />);

    await transporter.sendMail({
        from: `"LCComputerScience" <${env.EMAIL_USERNAME}>`,
        to: user.email,
        subject: "Password Reset request",
        html: htmlContent,
    });

    return { success: true };
};

export const sendVerificationEmail = async (
    user: { name: string; email: string },
    verifyLink: string,
) => {
    const htmlContent = await render(<EmailVerificationEmail user={user} verifyLink={verifyLink} contactEmail={env.CONTACT_EMAIL} />);

    await transporter.sendMail({
        from: `"LCComputerScience" <${env.EMAIL_USERNAME}>`,
        to: user.email,
        subject: "Verify your LCComputerScience account",
        html: htmlContent,
    });

    return { success: true };
};

export const sendContactEmail = async (
    name: string,
    email: string,
    message: string,
) => {
    const htmlContent = await render(<ContactEmail user={{ name, email }} message={message} />);

    await transporter.sendMail({
        from: `"LCComputerScience" <${env.EMAIL_USERNAME}>`,
        to: env.CONTACT_EMAIL,
        subject: "LCComputerScience Message",
        html: htmlContent,
    });

    return { success: true };
};
