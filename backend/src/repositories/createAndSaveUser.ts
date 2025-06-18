import { userRepository } from "./repository";

const createAndSaveUser = async ({
    email,
    hashedPassword,
}: {
    email: string;
    hashedPassword: string;
}) => {
    const userToSave = userRepository.create({
        email,
        password: hashedPassword,
    });
    const user = await userRepository.save(userToSave);
    return user;
};

export default createAndSaveUser;
