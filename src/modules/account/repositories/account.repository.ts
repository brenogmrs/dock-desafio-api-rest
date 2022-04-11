import { injectable } from 'tsyringe';
import { getRepository, Repository } from 'typeorm';
import { AccountEntity } from '../entities/account.entity';
import { ICreateAccount } from '../interfaces/account.interface';
import { IAccountRepository } from './interfaces/account.repository.interface';

@injectable()
export class AccountRepository implements IAccountRepository {
    private ormRepository: Repository<AccountEntity>;

    constructor() {
        this.ormRepository = getRepository(AccountEntity);
    }

    public async createAndSave(accountData: ICreateAccount): Promise<AccountEntity> {
        const account = this.ormRepository.create(accountData);

        return this.ormRepository.save(account);
    }

    public async findAll(): Promise<AccountEntity[]> {
        return this.ormRepository.find();
    }

    public async findById(accountId: string): Promise<AccountEntity | undefined> {
        return this.ormRepository.findOne({ id: accountId });
    }

    public async update(account: AccountEntity): Promise<AccountEntity> {
        return this.ormRepository.save(account);
    }

    public async delete(account: AccountEntity): Promise<void> {
        await this.ormRepository.remove(account);
    }
}
