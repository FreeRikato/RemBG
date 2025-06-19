import { instanceToPlain } from "class-transformer";
import { userRepository } from "./repository";

const deleteUser = async (id: string) => {
    const user = await userRepository.delete(id);
    return instanceToPlain(user);
};

export default deleteUser;
