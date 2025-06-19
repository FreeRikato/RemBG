import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Image } from "./Images";
import { Exclude } from "class-transformer";

/*
 * Crucial Step: Modify tsconfig.json to support TypeORM's decorators and property
 * "experimentalDecorators": true,
 * "emitDecoratorMetadata": true,
 * "strictPropertyInitialization": false => This will resolve the error: 🔽
 * Property <name> has no initializer and is not definitely assigned in the constructor
 */

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude() // Excluding password when transformed
    password: string;

    @OneToMany(() => Image, (image) => image.user)
    images: Image[];

    @CreateDateColumn()
    createdAt: Date;
}
