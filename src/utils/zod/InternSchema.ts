import { z } from "zod";

const createInternSchema = z.object({
    firstname: z.string({
        required_error: "Firstname Is Required!",
        invalid_type_error: "Firstname Must Be String!"
    })
        .min(3, "Firstname Must Be At Least 3 Characters Long!")
        .max(255, "Firstname Must Not Exceed 255 Characters!"),
    lastname: z.string({
        required_error: "Firstname Is Required!",
        invalid_type_error: "Firstname Must Be String!"
    })
        .min(3, "Firstname Must Be At Least 3 Charaters Long!")
        .max(255, "Firstname Must Not Exceed 255 Characters!"),
    email: z.string({
        required_error: "E-mail Is Required!"
    }).email("Must Be A Valid Email!"),
    birthdate: z.coerce.date(),
    school: z.string({
        required_error: "School Is Required!",
        invalid_type_error: "School Must Be String!"
    })
        .min(3, "School Must Be At Least 3 Characters Long!")
        .max(255, "School Must Not Exceed 255 Characters!"),
    mentor: z.string({
        required_error: "Mentor Is Required!",
        invalid_type_error: "Mentor Must Be String!"
    })
        .min(3, "Mentor Must Be At Least 3 Characters Long!")
        .max(255, "Mentor Must Not Exceed 255 Characters!"),
    role: z.string({
        required_error: "Role Is Required!",
        invalid_type_error: "Role Must Be String!"
    })
        .min(3, "Role Must Be At Least 3 Characters Long!")
        .max(255, "Role Must Not Exceed 255 Characters!"),
    password: z.string()
        .min(8, "Password Must Be At Least 8 Characters Long!")
        .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])/, "Password Must Containt At Least One Number And One Special Character!"),
    confirmPassword: z.string().optional().nullable()
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password And Confirm Password Are Not Match!",
});

const updateInternSchema = z.object({
    firstname: z.string({
        required_error: "Firstname Is Required!",
        invalid_type_error: "Firstname Must Be String!"
    })
        .min(3, "Firstname Must Be At Least 3 Characters Long!")
        .max(255, "Firstname Must Not Exceed 255 Characters!"),
    lastname: z.string({
        required_error: "Firstname Is Required!",
        invalid_type_error: "Firstname Must Be String!"
    })
        .min(3, "Firstname Must Be At Least 3 Charaters Long!")
        .max(255, "Firstname Must Not Exceed 255 Characters!"),
    email: z.string({
        required_error: "E-mail Is Required!"
    }).email("Must Be A Valid Email!"),
    birthdate: z.coerce.date(),
    school: z.string({
        required_error: "School Is Required!",
        invalid_type_error: "School Must Be String!"
    })
        .min(3, "School Must Be At Least 3 Characters Long!")
        .max(255, "School Must Not Exceed 255 Characters!"),
    mentor: z.string({
        required_error: "Mentor Is Required!",
        invalid_type_error: "Mentor Must Be String!"
    })
        .min(3, "Mentor Must Be At Least 3 Characters Long!")
        .max(255, "Mentor Must Not Exceed 255 Characters!"),
    role: z.string({
        required_error: "Role Is Required!",
        invalid_type_error: "Role Must Be String!"
    })
        .min(3, "Role Must Be At Least 3 Characters Long!")
        .max(255, "Role Must Not Exceed 255 Characters!")
});

const updateInternPasswordSchema = z.object({
    currentPassword: z.string()
        .min(8, "Password Must Be At Least 8 Characters Long!")
        .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])/, "Password Must Containt At Least One Number And One Special Character!"),
    newPassword: z.string()
        .min(8, "Password Must Be At Least 8 Characters Long!")
        .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])/, "Password Must Containt At Least One Number And One Special Character!"),
    confirmPassword: z.string().optional().nullable()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "New Password and Confirm Password Do Dot Match",
    path: ["confirmPassword"],
});

const authenticateInternSchema = z.object({
    email: z.string({
        required_error: "E-mail Is Required!"
    }).email("Must Be A Valid Email!"),
    password: z.string({
        required_error: "Password Is Required!"
    })
});

export {
    createInternSchema,
    updateInternSchema,
    updateInternPasswordSchema,
    authenticateInternSchema
}