import { inject, injectable } from 'tsyringe';
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

        if (foundAccount.active && foundAccount.status === AccountStatus.AVAILABLE) {
            foundAccount.balance += amount;
        }

        return this.accountRepository.update(foundAccount);
    }
}
