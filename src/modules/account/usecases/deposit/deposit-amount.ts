import { inject, injectable } from 'tsyringe';
import { HttpError } from '../../../../common/errors/http.error';
import { AccountEntity } from '../../entities/account.entity';
import { AccountStatus } from '../../interfaces/account.interface';
import { IAccountRepository } from '../../repositories/interfaces/account.repository.interface';
import { FindAccountByIdUseCase } from '../find-by-id/find-account-by-id';

@injectable()
export class DepositAmountUseCase {
    constructor(
        @inject('AccountRepository')
        private accountRepository: IAccountRepository,

        @inject('FindAccountByIdUseCase')
        private findAccountByIdUseCase: FindAccountByIdUseCase,
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

        return this.accountRepository.update(foundAccount);
    }

    private addValueToBalance(balance: number, amount: number): number {
        return +(+balance + amount).toFixed(2);
    }
}
