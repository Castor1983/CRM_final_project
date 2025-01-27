import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ManagerRole} from "../enums/managerRole.enum";
import {TableNameEnum} from "../enums/table-name.enum";
import {RefreshTokenEntity} from "./refresh-token.entity";

@Entity(TableNameEnum.MANAGERS)
export class ManagerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('text')
    surname: string;

    @Column('varchar', { length: 255, unique: true })
    email: string;

    @Column('text', { select: false, nullable: true, default: null })
    password: string ;

    @Column('boolean', { default: false })
    is_active: boolean;

    @Column({ type: 'enum', enum: ManagerRole, default: ManagerRole.MANAGER })
    role: ManagerRole;

    @Column({ type: 'date', nullable: true })
    last_login: Date | null;

    @Column('boolean', { default: false })
    is_banned: boolean

    @OneToMany(() => RefreshTokenEntity, (entity) => entity.manager)
    refreshTokens?: RefreshTokenEntity[];
}