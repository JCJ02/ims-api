import { z } from "zod";

const sendingEmailSchema = z.object({
    to: z.string({
        required_error: "E-mail Is Required!"
    }).email("Must Be A Valid Email!"),
    subject: z.string()
        .max(255, "Subject Must Not Exceed 255 Characters!"),
    message: z.string({
        required_error: "Message Is Required!"
    })
        .max(255, "Message Must Not Exceed 255 Characters!"),
});

export {
    sendingEmailSchema
}