import { userRepository } from "./repository";

const findOneByEmail = async (email: string) => {
    const userExists = await userRepository.findOneBy({ email });
    return userExists;
};

export default findOneByEmail;
