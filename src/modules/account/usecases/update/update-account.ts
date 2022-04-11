import { inject, injectable } from 'tsyringe';
import { HttpError } from '../../../../common/errors/http.error';
import { AccountEntity } from '../../entities/account.entity';
import { AccountStatus, IUpdateAccount } from '../../interfaces/account.interface';
import { IAccountRepository } from '../../repositories/interfaces/account.repository.interface';
import { FindAccountByIdUseCase } from '../find-by-id/find-account-by-id';

@injectable()
export class UpdateAccountUseCase {
    constructor(
        @inject('AccountRepository')
        private accountRepository: IAccountRepository,

        @inject('FindAccountByIdUseCase')
        private getByIdUseCase: FindAccountByIdUseCase,
    ) {}

    public async execute(
        id: string,
        accountData: IUpdateAccount,
    ): Promise<AccountEntity> {
        const foundAccount = await this.getByIdUseCase.execute(id);

        if (
            foundAccount.active === false &&
            accountData.active === foundAccount.active
        ) {
            throw new HttpError(
                '[Conflict] - This account is already inactive.',
                409,
            );
        }

        if (
            foundAccount.status === AccountStatus.BLOCKED &&
            accountData.status === foundAccount.status
        ) {
            throw new HttpError(
                '[Conflict] - This account is already blocked.',
                409,
            );
        }

        const updatedAccount = {
            ...foundAccount,
            ...accountData,
        };

        return this.accountRepository.update(updatedAccount);
    }
}
