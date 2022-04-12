import { inject, injectable } from 'tsyringe';
import { FindAccountByIdUseCase } from '../../../account/usecases/find-by-id/find-account-by-id';
import { TransactionEntity } from '../../entities/transaction.entity';
import { ICreateTransaction } from '../../interfaces/transaction.interface';
import { TransactionRepository } from '../../repositories/transaction.repository';

@injectable()
export class CreateTransactionUseCase {
    constructor(
        @inject('TransactionRepository')
        private readonly transactionRepository: TransactionRepository,

        @inject('FindAccountByIdUseCase')
        private readonly findAccountByIdUseCase: FindAccountByIdUseCase,
    ) {}

    public async execute(
        transactionData: ICreateTransaction,
    ): Promise<TransactionEntity> {
        const { account_id } = transactionData;

        await this.findAccountByIdUseCase.execute(account_id);

        const transactionToCreate = {
            ...transactionData,
            account_id,
        };

        return this.transactionRepository.createAndSave(transactionToCreate);
    }
}
