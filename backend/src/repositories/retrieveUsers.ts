import { instanceToPlain } from "class-transformer";
import { userRepository } from "./repository";

const retrieveUsers = async () => {
    const users = await userRepository.find();
    return users.map((user) => instanceToPlain(user));
};

export default retrieveUsers;
