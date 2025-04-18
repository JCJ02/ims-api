import { z } from "zod";

const createAdminSchema = z.object({
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
        .min(3, "Lastname Must Be At Least 3 Characters Long!")
        .max(255, "Lastname Must Not Exceed 255 Characters!"),
    email: z.string({
        required_error: "E-mail Is Required!"
    }).email("Must Be A Valid E-mail!"),
    password: z.string()
        .min(8, "Password Must Be At Least 8 Characters Long!")
        .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])/, "Password Must Containt At Least One Number And One Special Character!"),
    confirmPassword: z.string().optional().nullable()
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password And Confirm Password Are Not Match!",
});

const updateAdminSchema = z.object({
    firstname: z.string({
        required_error: "Firstname Is Required!",
        invalid_type_error: "Firstname Must Be String!"
    })
        .min(3, "Firstname Must Be At Least 3 Characters Long!")
        .max(255, "Firstname Must Not Exceed 255 Characters!"),
    lastname: z.string({
        required_error: "Lastname Is Required!",
        invalid_type_error: "Firstname Must Be String!"
    })
        .min(3, "Firstname Must Be At Least 3 Charaters Long!")
        .max(255, "Firstname Must Not Exceed 255 Characters!"),
    email: z.string({
        required_error: "E-mail Is Required!"
    }).email("Must Be A Valid Email!"),
});

const updateAdminPasswordSchema = z.object({
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

const authenticateAdminSchema = z.object({
    email: z.string({
        required_error: "E-mail Is Required!"
    }).email("Must Be A Valid Email!"),
    password: z.string({
        required_error: "Password Is Required!"
    })
});

export {
    createAdminSchema,
    updateAdminSchema,
    updateAdminPasswordSchema,
    authenticateAdminSchema
}