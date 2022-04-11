import { inject, injectable } from 'tsyringe';
import { HttpError } from '../../../../common/errors/http.error';
import { AccountEntity } from '../../entities/account.entity';
import { IAccountRepository } from '../../repositories/interfaces/account.repository.interface';
import { FindAccountByIdUseCase } from '../find-by-id/find-account-by-id';

@injectable()
export class ActivateAccountUseCase {
    constructor(
        @inject('AccountRepository')
        private accountRepository: IAccountRepository,

        @inject('FindAccountByIdUseCase')
        private findAccountByIdUseCase: FindAccountByIdUseCase,
    ) {}

    public async execute(accountId: string): Promise<AccountEntity> {
        const foundAccount = await this.findAccountByIdUseCase.execute(accountId);

        return this.accountRepository.update({
            ...foundAccount,
            active: true,
        });
    }
}
