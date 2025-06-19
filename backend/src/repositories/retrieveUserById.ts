import { userRepository } from "./repository";

const retrieveUserById = async (id: string) => {
    const user = await userRepository.findOneBy({ id });
    return user;
};

export default retrieveUserById;
