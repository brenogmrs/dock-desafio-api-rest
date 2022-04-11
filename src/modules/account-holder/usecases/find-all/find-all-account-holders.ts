import { inject, injectable } from 'tsyringe';
import { AccountHolderEntity } from '../../entities/account-holder.entity';
import { IAccountHolderRepository } from '../../repositories/interfaces/account-holder.repository';

@injectable()
export class FindAllAccountHoldersUseCase {
    constructor(
        @inject('AccountHolderRepository')
        private accountHolderRepository: IAccountHolderRepository,
    ) {}

    public async execute(): Promise<AccountHolderEntity[]> {
        return this.accountHolderRepository.findAll();
    }
}
