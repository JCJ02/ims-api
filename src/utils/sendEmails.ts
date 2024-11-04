import nodeMailer from "nodemailer";
import path from "path";
import ejs from "ejs";

const sendEmails = async (options: any) => {

    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const templatePath = path.resolve(process.cwd(), "src", "utils", "templates", "emailTemplate.ejs");
    const htmlContent = await ejs.renderFile(templatePath, { message: options.message });

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: options.to,
        subject: options.subject,
        html: htmlContent,
    };

    return await transporter.sendMail(mailOptions);

}

export {
    sendEmails
}
