import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Image {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: true })
    original_url: string;

    @Column({ nullable: true })
    processed_url: string;

    @Column({
        type: "enum",
        enum: ["pending", "processing", "done", "failed"],
        default: "pending",
    })
    status: "pending" | "processing" | "done" | "failed";

    @Column({ nullable: true })
    error_message: string;

    @ManyToOne(() => User, (user) => user.images, { nullable: true })
    user: User;

    @CreateDateColumn()
    createdAt: Date;
}
