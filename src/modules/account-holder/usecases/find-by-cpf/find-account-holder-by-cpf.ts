import { inject, injectable } from 'tsyringe';
import { HttpError } from '../../../../common/errors/http.error';
import { AccountHolderEntity } from '../../entities/account-holder.entity';
import { IAccountHolderRepository } from '../../repositories/interface/account-holder.repository';

@injectable()
export class FindAccountHolderByCpfUseCase {
    constructor(
        @inject('AccountHolderRepository')
        private accountHolderRepository: IAccountHolderRepository,
    ) {}

    public async execute(accountHolderCpf: string): Promise<AccountHolderEntity> {
        const founcAccountHolder = await this.accountHolderRepository.findByCpf(
            accountHolderCpf,
        );

        if (!founcAccountHolder) {
            throw new HttpError(
                '[Not found] - Account holder not found for this cpf.',
                404,
            );
        }

        return founcAccountHolder;
    }
}
