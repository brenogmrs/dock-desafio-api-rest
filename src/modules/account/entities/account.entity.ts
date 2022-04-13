import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/BaseEntity';
import { AccountHolderEntity } from '../../account-holder/entities/account-holder.entity';
import { TransactionEntity } from '../../transaction/entities/transaction.entity';

@Entity('account')
export class AccountEntity extends BaseEntity {
    @Column('uuid')
    account_holder_id: string;

    @Column()
    number: string;

    @Column()
    agency: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0.0,
    })
    balance: number;

    @Column({ default: 'AVAILABLE' })
    status: string;

    @Column({ default: true })
    active: boolean;

    @OneToOne(
        () => AccountHolderEntity,
        accountHolderEntity => accountHolderEntity.account,
        { eager: true },
    )
    @JoinColumn({ name: 'account_holder_id' })
    account_holder: AccountHolderEntity;

    @OneToMany(() => TransactionEntity, transaction => transaction.account)
    transactions: TransactionEntity[];
}
