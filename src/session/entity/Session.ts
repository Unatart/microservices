import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Session {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({type: "uuid", nullable: true})
    user_id:string;

    @Column({nullable: true})
    service_name:string;

    @Column({nullable:true})
    app_id:string;

    @Column({nullable:true})
    app_secret:string;

    @Column({nullable: true})
    code:string;

    @Column({nullable: true})
    token:string;

    @Column({nullable: true})
    refresh_token:string;

    @Column({nullable: true})
    expires:string;
}
