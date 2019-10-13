import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Story {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    theme: string;
    
    @Column()
    author: string;

    @Column({type: "text"})
    article: string;
}