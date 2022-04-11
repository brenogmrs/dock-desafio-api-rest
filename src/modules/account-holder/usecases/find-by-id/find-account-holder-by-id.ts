import { inject, injectable } from 'tsyringe';
import { HttpError } from '../../../../common/errors/http.error';
import { AccountHolderEntity } from '../../entities/account-holder.entity';
import { IAccountHolderRepository } from '../../repositories/interfaces/account-holder.repository';

@injectable()
export class FindAccountHolderByIdUseCase {
    constructor(
        @inject('AccountHolderRepository')
        private accountHolderRepository: IAccountHolderRepository,
    ) {}

    public async execute(accountHolderId: string): Promise<AccountHolderEntity> {
        const foundAccountHolder = await this.accountHolderRepository.findById(
            accountHolderId,
        );

        if (!foundAccountHolder) {
            throw new HttpError('[Not found] - Account Holder not found.', 404);
        }

        return foundAccountHolder;
    }
}
