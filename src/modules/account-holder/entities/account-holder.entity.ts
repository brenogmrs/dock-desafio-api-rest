import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/BaseEntity';

@Entity('account_holder')
export class AccountHolderEntity extends BaseEntity {
    @Column()
    full_name: string;

    @Column({ unique: true })
    cpf: string;
}
