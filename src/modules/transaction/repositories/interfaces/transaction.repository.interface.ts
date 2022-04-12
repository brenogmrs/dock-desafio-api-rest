import { TransactionEntity } from '../../entities/transaction.entity';
import { ICreateTransaction } from '../../interfaces/transaction.interface';

export interface ITransactionRepository {
    createAndSave(transactionData: ICreateTransaction): Promise<TransactionEntity>;
    findAll(): Promise<TransactionEntity[]>;
    findById(transactionId: string): Promise<TransactionEntity | undefined>;
}
