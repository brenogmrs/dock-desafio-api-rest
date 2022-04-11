import { inject, injectable } from 'tsyringe';
import { AccountHolderEntity } from '../../entities/account-holder.entity';
import { IUpdateAccountHolder } from '../../interfaces/account-holder.interface';
import { IAccountHolderRepository } from '../../repositories/interfaces/account-holder.repository';
import { FindAccountHolderByIdUseCase } from '../find-by-id/find-account-holder-by-id';

@injectable()
export class UpdateAccountHolderUseCase {
    constructor(
        @inject('AccountHolderRepository')
        private accountHolderRepository: IAccountHolderRepository,

        @inject('FindAccountHolderByIdUseCase')
        private getByIdUseCase: FindAccountHolderByIdUseCase,
    ) {}

    public async execute(
        id: string,
        accountHolderData: IUpdateAccountHolder,
    ): Promise<AccountHolderEntity> {
        const foundAccountHolder = await this.getByIdUseCase.execute(id);

        const updatedAccountHolder = {
            ...foundAccountHolder,
            ...accountHolderData,
        };

        if (accountHolderData.full_name) {
            updatedAccountHolder.full_name =
                accountHolderData.full_name.toUpperCase();
        }

        return this.accountHolderRepository.update(updatedAccountHolder);
    }
}
