import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Session {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({type: "uuid"})
    user_id:string;

    @Column({type: "string"})
    service_name:string;

    @Column({type: "string"})
    token:string;

    @Column({type: "string"})
    refresh_token:string;

    @Column({type: "timestamp"})
    expires:string;
}
