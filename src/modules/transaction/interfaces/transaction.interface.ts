/* eslint-disable no-shadow */
export enum OperationTypes {
    DEPOSIT = 'DEPOSIT',
    WITHDRAW = 'WITHDRAW',
}

export interface ICreateTransaction {
    account_id: string;
    operation_type: OperationTypes;
    operation_date: string;
    amount: number;
}

export interface TransactionFilters {
    operation_type?: OperationTypes;
    startDateFilter?: string;
    endDateFilter?: string;
}
