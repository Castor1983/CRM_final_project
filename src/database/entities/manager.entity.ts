import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {ManagerRole} from "../enums/managerRole.enum";

@Entity('managers')
export class ManagerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('text')
    surname: string;

    @Column('varchar', { unique: true, length: 255 })
    email: string;

    @Column('text', { select: false })
    password: string;

    @Column('boolean', { default: false })
    is_active: boolean;

    @Column({ type: 'enum', enum: ManagerRole, default: ManagerRole.MANAGER })
    role: ManagerRole;

    @Column({ type: 'date', nullable: true })
    last_login: Date | null;
}