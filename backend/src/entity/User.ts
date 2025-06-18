import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

/*
 * Crucial Step: Modify tsconfig.json to support TypeORM's decorators and property
 * "experimentalDecorators": true,
 * "emitDecoratorMetadata": true,
 * "strictPropertyInitialization": false => This will resolve the error: 🔽
 * Property <name> has no initializer and is not definitely assigned in the constructor
 */

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
