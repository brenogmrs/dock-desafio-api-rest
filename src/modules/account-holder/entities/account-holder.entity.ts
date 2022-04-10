import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/BaseEntity';
import { AccountEntity } from '../../account/entities/account.entity';

@Entity('account_holder')
export class AccountHolderEntity extends BaseEntity {
    @Column()
    full_name: string;

    @Column({ unique: true })
    cpf: string;

    @OneToOne(() => AccountEntity, acc => acc.account_holder, {
        cascade: true,
        eager: true,
    })
    account: AccountEntity;
}
