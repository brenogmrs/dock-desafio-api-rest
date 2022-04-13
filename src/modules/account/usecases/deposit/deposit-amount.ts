import { format } from 'date-fns-tz';
import { inject, injectable } from 'tsyringe';
import { HttpError } from '../../../../common/errors/http.error';
import { OperationTypes } from '../../../transaction/interfaces/transaction.interface';
import { CreateTransactionUseCase } from '../../../transaction/usecases/create/create-transaction';
import { AccountEntity } from '../../entities/account.entity';
import { AccountStatus } from '../../interfaces/account.interface';
import { IAccountRepository } from '../../repositories/account.repository.interface';
import { FindAccountByIdUseCase } from '../find-by-id/find-account-by-id';

@injectable()
export class DepositAmountUseCase {
    constructor(
        @inject('AccountRepository')
        private accountRepository: IAccountRepository,

        @inject('FindAccountByIdUseCase')
        private findAccountByIdUseCase: FindAccountByIdUseCase,

        @inject('CreateTransactionUseCase')
        private createTransactionUseCase: CreateTransactionUseCase,
    ) {}

    public async execute(accountId: string, amount: number): Promise<AccountEntity> {
        const foundAccount = await this.findAccountByIdUseCase.execute(accountId);

        if (!foundAccount.active) {
            throw new HttpError('[Conflict] - This account is not active.', 409);
        }

        if (foundAccount.status === AccountStatus.BLOCKED) {
            throw new HttpError('[Conflict] - This account is blocked.', 409);
        }

        foundAccount.balance = this.addValueToBalance(foundAccount.balance, amount);

        await this.createTransactionUseCase.execute({
            amount,
            account_id: foundAccount.id,
            operation_type: OperationTypes.DEPOSIT,
            operation_date: format(new Date(), 'yyyy-MM-dd'),
        });

        return this.accountRepository.update(foundAccount);
    }

    private addValueToBalance(balance: number, amount: number): number {
        return +(+balance + amount).toFixed(2);
    }
}
