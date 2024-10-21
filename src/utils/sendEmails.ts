import nodeMailer from "nodemailer";

const sendEmails = async(options: any) => {

    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
     });

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: options.to,
        subject: options.subject,
        text: options.message,
        html: `
            <html>
                <body 
                    style="
                        margin: 0; 
                        padding: 0; 
                        width: 100%; 
                        height: 100%; 
                        background-color: #f4f4f4;"
                    >
                    <table 
                        role="presentation"
                        style="
                            width: 100%; 
                            height: 100%; 
                            border: 0; 
                            cellspacing: 0; 
                            cellpadding: 0;"
                    >
                        <tr>
                            <td 
                                align="center" 
                                style="padding: 20px;"
                            >
                                <table 
                                    style="
                                        width: 100%; 
                                        max-width: 1024px;
                                        background-color: #ffffff; 
                                        border-radius: 10px; 
                                        padding: 20px;"
                                >
                                    <tr>
                                        <td 
                                            align="center"
                                            style=" 
                                                padding: 20px; 
                                                text-align: left; 
                                                font-family: Arial, sans-serif; 
                                                font-size: 16px; 
                                                color: #333333;"
                                            >
                                            <img style="display: block; margin: 0 auto; height: 360px;" src="https://ongo.ph/static/1c1edc91f46025044ae65ee4f09b38d5/17101/lightweight.png">
                                            <p style="margin: 0 0 16px;">${options.message}</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
            </html>`,
    };

    return await transporter.sendMail(mailOptions);

}

export {
    sendEmails
}
