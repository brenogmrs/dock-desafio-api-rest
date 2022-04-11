import { inject, injectable } from 'tsyringe';
import { IAccountHolderRepository } from '../../repositories/interfaces/account-holder.repository';
import { FindAccountHolderByIdUseCase } from '../find-by-id/find-account-holder-by-id';

@injectable()
export class DeleteAccountHolderUseCase {
    constructor(
        @inject('AccountHolderRepository')
        private accountHolderRepository: IAccountHolderRepository,

        @inject('FindAccountHolderByIdUseCase')
        private getByIdUseCase: FindAccountHolderByIdUseCase,
    ) {}

    public async execute(id: string): Promise<void> {
        const foundAccountHolder = await this.getByIdUseCase.execute(id);

        return this.accountHolderRepository.delete(foundAccountHolder);
    }
}
