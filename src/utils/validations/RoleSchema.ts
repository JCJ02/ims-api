import { z } from "zod";

const roleSchema = z.object({
    roleName: z.string({
        required_error: "Role Name Is Required!",
        invalid_type_error: "Role Name Must Be String!"
    })
        .min(3, "Role Name Must Be At Least 3 Characters Long!")
        .max(255, "Role Name Must Not Exceed 255 Characters!"),
    roleDescription: z.string({
        required_error: "Role Description Is Required!",
        invalid_type_error: "Role Description Must Be A String!"
    })
        .min(3, "Role Description Must Be At Least 3 Characters Long!")
        .max(255, "Role Description Must Not Exceed 255 Characters!"),
});

export {
    roleSchema
}