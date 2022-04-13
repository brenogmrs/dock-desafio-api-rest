import { IRepository } from '../../../common/interfaces/repository';
import { AccountEntity } from '../entities/account.entity';
import { ICreateAccount } from '../interfaces/account.interface';

export interface IAccountRepository extends IRepository<AccountEntity> {
    createAndSave(accountData: ICreateAccount): Promise<AccountEntity>;
}
