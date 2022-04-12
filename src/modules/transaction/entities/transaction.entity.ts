import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/BaseEntity';
import { AccountEntity } from '../../account/entities/account.entity';

@Entity('transactions')
export class TransactionEntity extends BaseEntity {
    @Column('uuid')
    account_id: string;

    @Column()
    operation_type: string;

    @Column()
    operation_date: string;

    @Column()
    amount: number;

    @ManyToOne(() => AccountEntity, account => account.transactions)
    @JoinColumn({ name: 'account_id' })
    account: AccountEntity;
}
