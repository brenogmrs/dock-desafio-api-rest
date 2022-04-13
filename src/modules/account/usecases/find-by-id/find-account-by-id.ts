import { inject, injectable } from 'tsyringe';
import { HttpError } from '../../../../common/errors/http.error';
import { AccountEntity } from '../../entities/account.entity';
import { IAccountRepository } from '../../repositories/account.repository.interface';

@injectable()
export class FindAccountByIdUseCase {
    constructor(
        @inject('AccountRepository')
        private accountRepository: IAccountRepository,
    ) {}

    public async execute(accountId: string): Promise<AccountEntity> {
        const foundAccount = await this.accountRepository.findById(accountId);

        if (!foundAccount) {
            throw new HttpError('[Not found] - Account not found.', 404);
        }

        return foundAccount;
    }
}
