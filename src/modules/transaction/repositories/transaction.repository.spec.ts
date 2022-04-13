import { getConnection } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { getDatabaseConfigConnectionQA } from '../../../config/database/connection';
import { TransactionEntity } from '../entities/transaction.entity';
import { OperationTypes } from '../interfaces/transaction.interface';
import { TransactionRepository } from './transaction.repository';

describe('transaction repository context', () => {
    let transactionRepository: TransactionRepository;

    beforeEach(async () => {
        await getConnection().query('PRAGMA foreign_keys=OFF');
    });

    beforeAll(async () => {
        await getDatabaseConfigConnectionQA();

        transactionRepository = new TransactionRepository();
    });

    afterEach(async () => {
        await getConnection().manager.clear(TransactionEntity);
        jest.resetAllMocks();
    });

    afterAll(async () => {
        await getConnection().close();
    });

    it('should create a transaction', async () => {
        const data = {
            account_id: uuid(),
            operation_type: OperationTypes.DEPOSIT,
            operation_date: '12-04-2022',
            amount: 200.0,
        };

        const res = await transactionRepository.createAndSave(data);

        expect(res).toEqual(expect.objectContaining(data));
    });

    it('should find and filter transactions for one account', async () => {
        const data = {
            account_id: uuid(),
            operation_type: OperationTypes.DEPOSIT,
            operation_date: '2022-04-12',
            amount: 200.0,
        };
        await transactionRepository.createAndSave(data);

        await transactionRepository.createAndSave({
            ...data,
            operation_date: '2022-04-13',
        });

        const foundTransactions =
            await transactionRepository.findAllTransactionsForAccount(
                data.account_id,
                {
                    operation_type: OperationTypes.DEPOSIT,
                    startDateFilter: '2022-04-12',
                    endDateFilter: '2022-04-13',
                },
            );

        expect(foundTransactions).toHaveLength(2);
    });
});
