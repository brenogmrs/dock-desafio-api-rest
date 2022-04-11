import { inject, injectable } from 'tsyringe';
import { HttpError } from '../../../../common/errors/http.error';
import { AccountHolderEntity } from '../../entities/account-holder.entity';
import { ICreateAccountHolder } from '../../interfaces/account-holder.interface';
import { IAccountHolderRepository } from '../../repositories/interfaces/account-holder.repository';

@injectable()
export class CreateAccountHolderUseCase {
    constructor(
        @inject('AccountHolderRepository')
        private accountHolderRepository: IAccountHolderRepository,
    ) {}

    public async execute(
        accountHolderData: ICreateAccountHolder,
    ): Promise<AccountHolderEntity> {
        const { full_name, cpf } = accountHolderData;

        const foundAccountHolder = await this.accountHolderRepository.findByCpf(cpf);

        if (foundAccountHolder) {
            throw new HttpError('[Conflict] - This cpf is already in use.', 409);
        }

        const upperCaseFullName = full_name.toUpperCase();

        return this.accountHolderRepository.createAndSave({
            ...accountHolderData,
            full_name: upperCaseFullName,
        });
    }
}
