import { z } from "zod";

const createMentorSchema = z.object({
    firstname: z.string({
        required_error: "Firstname Is Required!",
        invalid_type_error: "Firstname Must Be String!"
    })
        .min(3, "Firstname Must Be At Least 3 Characters Long!")
        .max(255, "Firstname Must Not Exceed 255 Characters!"),
    lastname: z.string({
        required_error: "Lastname Is Required!",
        invalid_type_error: "Lastname Must Be String!"
    })
        .min(3, "Lastname Must Be At Least 3 Charaters Long!")
        .max(255, "Lastname Must Not Exceed 255 Characters!"),
    email: z.string({
        required_error: "E-mail Is Required!"
    }).email("Must Be A Valid Email!"),
    role: z.string({
        required_error: "Role Is Required!",
        invalid_type_error: "Role Must Be String!"
    })
        .min(3, "Role Must Be At Least 3 Characters Long!")
        .max(255, "Role Must Not Exceed 255 Characters!"),
});

export {
    createMentorSchema
}