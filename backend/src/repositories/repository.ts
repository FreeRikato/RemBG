import { User } from "../entity/User";
import { Image } from "../entity/Images";
import { AppDataSource } from "../data-source";

export const userRepository = AppDataSource.getRepository(User);
export const imageRepository = AppDataSource.getRepository(Image);
