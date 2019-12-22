import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Session {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({type: "uuid", nullable: true})
    user_id:string;

    @Column({nullable: true})
    service_name:string;

    @Column()
    token:string;

    @Column({nullable: true})
    refresh_token:string;

    @Column()
    expires:string;
}
