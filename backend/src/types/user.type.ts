import * as yup from "yup";

/*
 * Defining the user schema
 * - email: a string of email type and cannot be null
 * - password: a string and cannot be null
 */

export const userSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required(),
});

export type userType = yup.InferType<typeof userSchema>;
