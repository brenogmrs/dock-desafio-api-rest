import { inject, injectable } from 'tsyringe';
import { FindAccountHolderByCpfUseCase } from '../../../account-holder/usecases/find-by-cpf/find-account-holder-by-cpf';
import { AccountEntity } from '../../entities/account.entity';
import {
    AccountStatus,
    ICreateAccountPayload,
} from '../../interfaces/account.interface';
import { IAccountRepository } from '../../repositories/account.repository.interface';

@injectable()
export class CreateAccountUseCase {
    constructor(
        @inject('AccountRepository')
        private accountRepository: IAccountRepository,

        @inject('FindAccountHolderByCpfUseCase')
        private findAccountHolderByCpfUseCase: FindAccountHolderByCpfUseCase,
    ) {}

    public async execute(
        accountData: ICreateAccountPayload,
    ): Promise<AccountEntity> {
        const { accountHolderCpf } = accountData;

        const foundAccountHolder = await this.findAccountHolderByCpfUseCase.execute(
            accountHolderCpf,
        );

        const accountToCreate = {
            ...accountData,
            account_holder_id: foundAccountHolder.id,
            status: AccountStatus.AVAILABLE,
            active: true,
        };

        return this.accountRepository.createAndSave(accountToCreate);
    }
}
