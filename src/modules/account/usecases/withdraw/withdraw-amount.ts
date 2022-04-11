import { inject, injectable } from 'tsyringe';
import { AccountEntity } from '../../entities/account.entity';
import { AccountStatus } from '../../interfaces/account.interface';
import { IAccountRepository } from '../../repositories/interfaces/account.repository.interface';
import { FindAccountByIdUseCase } from '../find-by-id/find-account-by-id';

@injectable()
export class WithdrawAmountUseCase {
    constructor(
        @inject('AccountRepository')
        private accountRepository: IAccountRepository,

        @inject('FindAccountByIdUseCase')
        private findAccountByIdUseCase: FindAccountByIdUseCase,
    ) {}

    public async execute(accountId: string, amount: number): Promise<AccountEntity> {
        const foundAccount = await this.findAccountByIdUseCase.execute(accountId);

        // adicionar validação de transactions aqui
        /*
            Saque é permitido para todas as contas ativas e desbloqueadas desde que haja saldo disponível e 
            não ultrapasse o limite diário de 2 mil reais

            const dailyLimit = pegar todas as transações diárias
        */

        if (
            foundAccount.active &&
            foundAccount.status === AccountStatus.AVAILABLE &&
            foundAccount.balance > 0 &&
            amount <= foundAccount.balance
        ) {
            foundAccount.balance -= amount;
        }

        return this.accountRepository.update(foundAccount);
    }
}
