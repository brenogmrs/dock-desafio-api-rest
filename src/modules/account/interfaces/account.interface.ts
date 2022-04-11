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
