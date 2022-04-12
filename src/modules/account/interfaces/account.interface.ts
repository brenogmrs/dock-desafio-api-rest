import { TransactionEntity } from '../../transaction/entities/transaction.entity';

// eslint-disable-next-line no-shadow
export enum AccountStatus {
    AVAILABLE = 'AVAILABLE',
    BLOCKED = 'BLOCKED',
}
export interface ICreateAccountPayload {
    accountHolderCpf: string;
    number: number;
    agency: string;
}
export interface ICreateAccount
    extends Omit<ICreateAccountPayload, 'accountHolderCpf'> {
    account_holder_id: string;
}
export interface IUpdateAccount {
    status?: AccountStatus;
    active?: boolean;
}

export interface IAccountStatement {
    agency: number;
    number: number;
    account_holder_name: string;
    total_deposit: number;
    total_withdraw: number;
    transactions: TransactionEntity[];
}
