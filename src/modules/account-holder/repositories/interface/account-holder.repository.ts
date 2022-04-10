import { IRepository } from '../../../../common/interfaces/repository';
import { AccountHolderEntity } from '../../entities/account-holder.entity';
import { ICreateAccountHolder } from '../../interfaces/account-holder.interface';

export interface IAccountHolderRepository extends IRepository<AccountHolderEntity> {
    createAndSave(
        accountHolderData: ICreateAccountHolder,
    ): Promise<AccountHolderEntity>;
    findByCpf(cpf: string): Promise<AccountHolderEntity | undefined>;
}
