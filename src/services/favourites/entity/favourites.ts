import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Favourites {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "uuid"})
    user_id: string;

    @Column({type: "uuid"})
    story_id: string;
}