import { injectable } from 'tsyringe';
import { getRepository, Repository } from 'typeorm';
import { TransactionEntity } from '../entities/transaction.entity';
import {
    ICreateTransaction,
    TransactionFilters,
} from '../interfaces/transaction.interface';
import { ITransactionRepository } from './transaction.repository.interface';

@injectable()
export class TransactionRepository implements ITransactionRepository {
    private ormRepository: Repository<TransactionEntity>;

    constructor() {
        this.ormRepository = getRepository(TransactionEntity);
    }

    public async createAndSave(
        transactionData: ICreateTransaction,
    ): Promise<TransactionEntity> {
        const transaction = this.ormRepository.create(transactionData);

        return this.ormRepository.save(transaction);
    }

    public async findAllTransactionsForAccount(
        account_id: string,
        filters: TransactionFilters,
    ): Promise<TransactionEntity[]> {
        const query = this.ormRepository.createQueryBuilder('t');

        if (account_id) {
            query.where(`t.account_id = '${account_id}'`);
        }

        if (filters.operation_type) {
            query.andWhere(`t.operation_type = '${filters.operation_type}'`);
        }

        if (filters.startDateFilter && filters.endDateFilter) {
            query.andWhere(
                `t.operation_date BETWEEN '${filters.startDateFilter}' AND '${filters.endDateFilter}'`,
            );
        }

        return query.getMany();
    }
}
