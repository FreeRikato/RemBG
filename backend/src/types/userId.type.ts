import * as yup from "yup";

export const userIdSchema = yup.object({
    id: yup.string().required(),
});
