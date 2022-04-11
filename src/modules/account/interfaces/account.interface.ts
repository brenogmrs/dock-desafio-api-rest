export interface ICreateAccountPayload {
    accountHolderCpf: string;
    number: number;
    agency: string;
    status: AccountStatus;
}

export interface ICreateAccount
    extends Omit<ICreateAccountPayload, 'accountHolderCpf'> {
    account_holder_id: string;
}

export interface IUpdateAccount {
    status?: AccountStatus;
}

export interface FindByIdResponse {
    number: number;
    agency: string;
    balance: number;
}

export enum AccountStatus {
    AVAILABLE = 'AVAILABLE',
    BLOCKED = 'BLOCKED',
}
