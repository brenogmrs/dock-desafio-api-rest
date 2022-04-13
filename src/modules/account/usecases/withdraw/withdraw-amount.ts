import { format } from 'date-fns-tz';
import { inject, injectable } from 'tsyringe';
import { HttpError } from '../../../../common/errors/http.error';
import {
    OperationTypes,
    TransactionFilters,
} from '../../../transaction/interfaces/transaction.interface';
import { CreateTransactionUseCase } from '../../../transaction/usecases/create/create-transaction';
import { FindAllTransactionsUseCase } from '../../../transaction/usecases/find-all/find-all-transactions';
import { AccountEntity } from '../../entities/account.entity';
import { AccountStatus } from '../../interfaces/account.interface';
import { IAccountRepository } from '../../repositories/account.repository.interface';
import { FindAccountByIdUseCase } from '../find-by-id/find-account-by-id';

@injectable()
export class WithdrawAmountUseCase {
    constructor(
        @inject('AccountRepository')
        private accountRepository: IAccountRepository,

        @inject('FindAccountByIdUseCase')
        private findAccountByIdUseCase: FindAccountByIdUseCase,

        @inject('CreateTransactionUseCase')
        private createTransactionUseCase: CreateTransactionUseCase,

        @inject('FindAllTransactionsUseCase')
        private findAllTransactionsUseCase: FindAllTransactionsUseCase,
    ) {}

    public async execute(accountId: string, amount: number): Promise<AccountEntity> {
        const foundAccount = await this.findAccountByIdUseCase.execute(accountId);

        if (!foundAccount.active) {
            throw new HttpError('[Conflict] - This account is not active.', 409);
        }

        if (foundAccount.status === AccountStatus.BLOCKED) {
            throw new HttpError('[Conflict] - This account is blocked.', 409);
        }

        if (foundAccount.balance <= amount) {
            throw new HttpError(
                '[Bad Request] - The amount withdrawed is bigger than the account balance.',
                400,
            );
        }

        if (amount > 2000.0) {
            throw new HttpError(
                '[Bad Request] - Your daily withdraw limit is 2000.0.',
                409,
            );
        }

        const withdrawedForTheday = await this.verifyDailyWithdrawLimit(
            foundAccount.id,
        );

        if (withdrawedForTheday + amount <= 2000.0) {
            await this.createTransactionUseCase.execute({
                amount,
                account_id: foundAccount.id,
                operation_type: OperationTypes.WITHDRAW,
                operation_date: format(new Date(), 'yyyy-MM-dd'),
            });
        } else {
            throw new HttpError(
                `[Conflict] - This transaciont would exceed your daily limit. At this point you can only withdraw the amount of: ${
                    2000 - withdrawedForTheday
                }`,
                409,
            );
        }

        foundAccount.balance = this.subtractValueToBalance(
            foundAccount.balance,
            amount,
        );

        return this.accountRepository.update(foundAccount);
    }

    public async verifyDailyWithdrawLimit(account_id: string): Promise<number> {
        const currentDate = format(new Date(), 'yyyy-MM-dd');

        const filters: TransactionFilters = {
            operation_type: OperationTypes.WITHDRAW,
            startDateFilter: currentDate,
            endDateFilter: currentDate,
        };

        const transactionsForAccount = await this.findAllTransactionsUseCase.execute(
            account_id,
            filters,
        );

        return transactionsForAccount.reduce((acc, current) => {
            return acc + current.amount;
        }, 0);
    }

    private subtractValueToBalance(balance: number, amount: number): number {
        return +(balance - amount).toFixed(2);
    }
}
