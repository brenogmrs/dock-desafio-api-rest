import 'reflect-metadata';
import sinon from 'sinon';
import { v4 as uuid } from 'uuid';
import { AccountRepository } from '../../../account/repositories/account.repository';
import { FindAccountByIdUseCase } from '../../../account/usecases/find-by-id/find-account-by-id';
import { OperationTypes } from '../../interfaces/transaction.interface';
import { TransactionRepository } from '../../repositories/transaction.repository';
import { CreateTransactionUseCase } from './create-transaction';

describe('create transaction use case', () => {
    let accountRepository: sinon.SinonStubbedInstance<AccountRepository>;
    let transactionRepository: sinon.SinonStubbedInstance<TransactionRepository>;

    let findAccountByIdUseCase: FindAccountByIdUseCase;
    let createTransactionUseCase: CreateTransactionUseCase;

    beforeEach(() => {
        sinon.restore();
        accountRepository = sinon.createStubInstance(AccountRepository);
        transactionRepository = sinon.createStubInstance(TransactionRepository);

        findAccountByIdUseCase = new FindAccountByIdUseCase(accountRepository);

        createTransactionUseCase = new CreateTransactionUseCase(
            transactionRepository,
            findAccountByIdUseCase,
        );
    });

    it('instances should be defined', async () => {
        expect(accountRepository).toBeDefined();
        expect(transactionRepository).toBeDefined();
        expect(createTransactionUseCase).toBeDefined();
        expect(findAccountByIdUseCase).toBeDefined();
    });

    it('should create a transaction', async () => {
        const accountId = uuid();

        const data = {
            account_id: accountId,
            operation_type: OperationTypes.DEPOSIT,
            operation_date: '2022-04-12',
            amount: 200.0,
        };

        const expectedRes = {
            ...data,
        };

        const findAccountByIdUseCaseSpy = jest
            .spyOn(findAccountByIdUseCase, 'execute')
            .mockResolvedValue(<any>{ id: data.account_id });

        const transactionRepositorySpy = jest
            .spyOn(transactionRepository, 'createAndSave')
            .mockResolvedValue(<any>expectedRes);

        const response = await createTransactionUseCase.execute(data);

        expect(response).toEqual(expectedRes);
        expect(findAccountByIdUseCaseSpy).toHaveBeenNthCalledWith(
            1,
            data.account_id,
        );
        expect(transactionRepositorySpy).toHaveBeenNthCalledWith(1, expectedRes);
    });
});
