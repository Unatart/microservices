import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Story {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    theme: string;

    @Column({type: "uuid"})
    author: string;

    @Column({type: "text"})
    article: string;
}