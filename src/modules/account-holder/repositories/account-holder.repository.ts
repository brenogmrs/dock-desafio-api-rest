import { injectable } from 'tsyringe';
import { getRepository, Repository } from 'typeorm';
import { AccountHolderEntity } from '../entities/account-holder.entity';
import { ICreateAccountHolder } from '../interfaces/account-holder.interface';
import { IAccountHolderRepository } from './interfaces/account-holder.repository';

@injectable()
export class AccountHolderRepository implements IAccountHolderRepository {
    private ormRepository: Repository<AccountHolderEntity>;

    constructor() {
        this.ormRepository = getRepository(AccountHolderEntity);
    }

    public async createAndSave(
        accountHolderData: ICreateAccountHolder,
    ): Promise<AccountHolderEntity> {
        const accountHolder = this.ormRepository.create(accountHolderData);

        return this.ormRepository.save(accountHolder);
    }

    public async findAll(): Promise<AccountHolderEntity[]> {
        return this.ormRepository.find();
    }

    public async findById(
        accountHolderId: string,
    ): Promise<AccountHolderEntity | undefined> {
        return this.ormRepository.findOne({ id: accountHolderId });
    }

    public async findByCpf(cpf: string): Promise<AccountHolderEntity | undefined> {
        return this.ormRepository.findOne({ cpf });
    }

    public async update(
        accountHolder: AccountHolderEntity,
    ): Promise<AccountHolderEntity> {
        return this.ormRepository.save(accountHolder);
    }

    public async delete(accountHolder: AccountHolderEntity): Promise<void> {
        await this.ormRepository.remove(accountHolder);
    }
}
