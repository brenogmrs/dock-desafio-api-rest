import { inject, injectable } from 'tsyringe';
import { TransactionEntity } from '../../../transaction/entities/transaction.entity';
import { TransactionFilters } from '../../../transaction/interfaces/transaction.interface';
import { FindAllTransactionsUseCase } from '../../../transaction/usecases/find-all/find-all-transactions';
import { IAccountStatement } from '../../interfaces/account.interface';
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
    ): Promise<IAccountStatement> {
        const foundAccount = await this.findAccountByIdUseCase.execute(account_id);
        const transactions = await this.findAllTransactionsUseCase.execute(
            account_id,
            filters,
        );

        const { total_deposit, total_withdraw } =
            this.sumTotalWithdrawAndDeposits(transactions);

        const data = {
            agency: foundAccount.agency,
            number: foundAccount.number,
            account_holder_name: foundAccount.account_holder.full_name,
            transactions,
            total_deposit,
            total_withdraw,
        } as any;

        return data;
    }

    private sumTotalWithdrawAndDeposits(transactions: TransactionEntity[]): {
        total_deposit: number;
        total_withdraw: number;
    } {
        const total_withdraw = transactions
            .filter(item => item.operation_type === 'WITHDRAW')
            .reduce((acc, current) => {
                return acc + current.amount;
            }, 0);

        const total_deposit = transactions
            .filter(item => item.operation_type === 'DEPOSIT')
            .reduce((acc, current) => {
                return acc + current.amount;
            }, 0);

        return { total_deposit, total_withdraw };
    }
}
