import { TransactionEntity } from '../entities/transaction.entity';
import {
    ICreateTransaction,
    TransactionFilters,
} from '../interfaces/transaction.interface';

export interface ITransactionRepository {
    createAndSave(transactionData: ICreateTransaction): Promise<TransactionEntity>;
    findAllTransactionsForAccount(
        account_id: string,
        filters: TransactionFilters,
    ): Promise<TransactionEntity[]>;
}
