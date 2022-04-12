import { inject, injectable } from 'tsyringe';
import { TransactionEntity } from '../../../transaction/entities/transaction.entity';
import { TransactionFilters } from '../../../transaction/interfaces/transaction.interface';
import { FindAllTransactionsUseCase } from '../../../transaction/usecases/find-all/find-all-transactions';
import { FindAccountByIdUseCase } from '../find-by-id/find-account-by-id';

@injectable()
export class AccountStatementUseCase {
    constructor(
        @inject('FindAccountByIdUseCase')
        private findAccountByIdUseCase: FindAccountByIdUseCase,

        @inject('FindAllTransactionsUseCase')
        private findAllTransactionsUseCase: FindAllTransactionsUseCase,
    ) {}

    public async execute(
        account_id: string,
        filters: TransactionFilters,
    ): Promise<TransactionEntity[]> {
        await this.findAccountByIdUseCase.execute(account_id);

        return this.findAllTransactionsUseCase.execute(account_id, filters);
    }
}
