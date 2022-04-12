import { inject, injectable } from 'tsyringe';
import { FindAccountByIdUseCase } from '../../../account/usecases/find-by-id/find-account-by-id';
import { TransactionEntity } from '../../entities/transaction.entity';
import { TransactionFilters } from '../../interfaces/transaction.interface';
import { TransactionRepository } from '../../repositories/transaction.repository';

@injectable()
export class FindAllTransactionsUseCase {
    constructor(
        @inject('TransactionRepository')
        private readonly transactionRepository: TransactionRepository,

        @inject('FindAccountByIdUseCase')
        private readonly findAccountByIdUseCase: FindAccountByIdUseCase,
    ) {}

    public async execute(
        account_id: string,
        filters: TransactionFilters,
    ): Promise<TransactionEntity[]> {
        await this.findAccountByIdUseCase.execute(account_id);

        return this.transactionRepository.findAllTransactionsForAccount(
            account_id,
            filters,
        );
    }
}
