import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "uuid" , unique: true})
    user_id: string;

    @Column()
    email: boolean;

    @Column()
    phone: boolean;
}