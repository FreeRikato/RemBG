import { userRepository } from "./repository";
import retrieveUserById from "./retrieveUserById";

const updateUser = async ({
    params_ID,
    email,
    hashedPassword,
}: {
    params_ID: string;
    email: string;
    hashedPassword: string;
}) => {
    const user = await retrieveUserById(params_ID);
    user!.email = email;
    user!.password = hashedPassword;

    const updatedUser = await userRepository.save(user!);
    return updatedUser;
};

export default updateUser;
