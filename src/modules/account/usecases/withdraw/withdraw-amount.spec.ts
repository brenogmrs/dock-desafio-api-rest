import 'reflect-metadata';
import sinon from 'sinon';
import { v4 as uuid } from 'uuid';
import { TransactionRepository } from '../../../transaction/repositories/transaction.repository';
import { CreateTransactionUseCase } from '../../../transaction/usecases/create/create-transaction';
import { FindAllTransactionsUseCase } from '../../../transaction/usecases/find-all/find-all-transactions';
import { AccountRepository } from '../../repositories/account.repository';
import { FindAccountByIdUseCase } from '../find-by-id/find-account-by-id';
import { WithdrawAmountUseCase } from './withdraw-amount';

describe.skip('Withdraw amount use case context', () => {
    let accountRepository: sinon.SinonStubbedInstance<AccountRepository>;
    let transactionRepository: sinon.SinonStubbedInstance<TransactionRepository>;

    let withdrawAmountUseCase: WithdrawAmountUseCase;
    let findAcountByIdUseCase: FindAccountByIdUseCase;
    let createTransactionUseCase: CreateTransactionUseCase;
    let findAllTransactionsUseCase: FindAllTransactionsUseCase;

    beforeEach(() => {
        accountRepository = sinon.createStubInstance(AccountRepository);
        transactionRepository = sinon.createStubInstance(TransactionRepository);

        createTransactionUseCase = new CreateTransactionUseCase(
            transactionRepository,
            findAcountByIdUseCase,
        );

        findAllTransactionsUseCase = new FindAllTransactionsUseCase(
            transactionRepository,
            findAcountByIdUseCase,
        );

        findAcountByIdUseCase = new FindAccountByIdUseCase(accountRepository);

        withdrawAmountUseCase = new WithdrawAmountUseCase(
            accountRepository,
            findAcountByIdUseCase,
            createTransactionUseCase,
            findAllTransactionsUseCase,
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('instances should be defined', async () => {
        expect(accountRepository).toBeDefined();
        expect(withdrawAmountUseCase).toBeDefined();
        expect(findAcountByIdUseCase).toBeDefined();
    });

    it('should not withdraw amount in inactive account', async () => {
        const accountData = {
            id: uuid(),
            agency: '123456-7',
            number: 1234,
            balance: 200.0,
            active: false,
            status: 'AVAILABLE',
        };
        const amount = 100.0;

        jest.spyOn(findAcountByIdUseCase, 'execute').mockResolvedValue(
            <any>accountData,
        );

        try {
            await withdrawAmountUseCase.execute(accountData.id, amount);
        } catch (error: any) {
            expect(error.message).toEqual(
                '[Conflict] - This account is not active.',
            );
            expect(error.code).toEqual(409);
        }
    });

    it('should not withdraw amount in blocked account', async () => {
        const accountData = {
            id: uuid(),
            agency: '123456-7',
            number: 1234,
            balance: 200.0,
            active: true,
            status: 'BLOCKED',
        };
        const amount = 100.0;

        jest.spyOn(findAcountByIdUseCase, 'execute').mockResolvedValue(
            <any>accountData,
        );

        try {
            await withdrawAmountUseCase.execute(accountData.id, amount);
        } catch (error: any) {
            expect(error.message).toEqual('[Conflict] - This account is blocked.');
            expect(error.code).toEqual(409);
        }
    });

    it('should not withdraw amount when balance is smaller than amount', async () => {
        const accountData = {
            id: uuid(),
            agency: '123456-7',
            number: 1234,
            balance: 100.0,
            active: true,
            status: 'AVAILABLE',
        };
        const amount = 200.0;

        jest.spyOn(findAcountByIdUseCase, 'execute').mockResolvedValue(
            <any>accountData,
        );

        try {
            await withdrawAmountUseCase.execute(accountData.id, amount);
        } catch (error: any) {
            expect(error.message).toEqual(
                '[Bad Request] - The amount withdrawed is bigger than the account balance.',
            );
            expect(error.code).toEqual(400);
        }
    });

    it('should not withdraw amount in blocked account', async () => {
        const accountData = {
            id: uuid(),
            agency: '123456-7',
            number: 1234,
            balance: 200.0,
            active: true,
            status: 'AVAILABLE',
        };
        const amount = 100.0;

        const expectedRes = {
            ...accountData,
            balance: accountData.balance - amount,
        };

        const findAcountByIdUseCaseSpy = jest
            .spyOn(findAcountByIdUseCase, 'execute')
            .mockResolvedValue(<any>accountData);

        const repositorySpy = jest
            .spyOn(accountRepository, 'update')
            .mockResolvedValue(<any>expectedRes);

        const response = await withdrawAmountUseCase.execute(accountData.id, amount);

        expect(response).toEqual(expectedRes);
        expect(findAcountByIdUseCaseSpy).toHaveBeenNthCalledWith(1, accountData.id);
        expect(repositorySpy).toHaveBeenNthCalledWith(1, expectedRes);
    });
});
