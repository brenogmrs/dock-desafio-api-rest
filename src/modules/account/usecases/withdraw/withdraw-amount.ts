import { inject, injectable } from 'tsyringe';
import { HttpError } from '../../../../common/errors/http.error';
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

            const dailyLimit = pegar todas as transações para aquele dia
        */

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

        foundAccount.balance = this.subtractValueToBalance(
            foundAccount.balance,
            amount,
        );

        return this.accountRepository.update(foundAccount);
    }

    private subtractValueToBalance(balance: number, amount: number): number {
        return +(balance - amount).toFixed(2);
    }
}
