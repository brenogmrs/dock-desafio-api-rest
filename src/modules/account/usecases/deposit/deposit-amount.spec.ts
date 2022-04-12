import 'reflect-metadata';
import sinon from 'sinon';
import { v4 as uuid } from 'uuid';
import { TransactionRepository } from '../../../transaction/repositories/transaction.repository';
import { CreateTransactionUseCase } from '../../../transaction/usecases/create/create-transaction';
import { AccountRepository } from '../../repositories/account.repository';
import { FindAccountByIdUseCase } from '../find-by-id/find-account-by-id';
import { DepositAmountUseCase } from './deposit-amount';

describe('Deposit amount use case context', () => {
    let accountRepository: sinon.SinonStubbedInstance<AccountRepository>;
    let transactionRepository: sinon.SinonStubbedInstance<TransactionRepository>;

    let depositAmountUseCase: DepositAmountUseCase;
    let findAcountByIdUseCase: FindAccountByIdUseCase;
    let createTransactionUseCase: CreateTransactionUseCase;

    beforeEach(() => {
        accountRepository = sinon.createStubInstance(AccountRepository);
        transactionRepository = sinon.createStubInstance(TransactionRepository);

        createTransactionUseCase = new CreateTransactionUseCase(
            transactionRepository,
            findAcountByIdUseCase,
        );

        findAcountByIdUseCase = new FindAccountByIdUseCase(accountRepository);

        depositAmountUseCase = new DepositAmountUseCase(
            accountRepository,
            findAcountByIdUseCase,
            createTransactionUseCase,
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('instances should be defined', async () => {
        expect(accountRepository).toBeDefined();
        expect(depositAmountUseCase).toBeDefined();
        expect(findAcountByIdUseCase).toBeDefined();
    });

    it('should not deposit amount in inactive account', async () => {
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
            await depositAmountUseCase.execute(accountData.id, amount);
        } catch (error: any) {
            expect(error.message).toEqual(
                '[Conflict] - This account is not active.',
            );
            expect(error.code).toEqual(409);
        }
    });

    it('should not deposit amount in blocked account', async () => {
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
            await depositAmountUseCase.execute(accountData.id, amount);
        } catch (error: any) {
            expect(error.message).toEqual('[Conflict] - This account is blocked.');
            expect(error.code).toEqual(409);
        }
    });

    it('should not deposit amount in blocked account', async () => {
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
            balance: accountData.balance + amount,
        };

        const findAcountByIdUseCaseSpy = jest
            .spyOn(findAcountByIdUseCase, 'execute')
            .mockResolvedValue(<any>accountData);

        const repositorySpy = jest
            .spyOn(accountRepository, 'update')
            .mockResolvedValue(<any>expectedRes);

        const response = await depositAmountUseCase.execute(accountData.id, amount);

        expect(response).toEqual(expectedRes);
        expect(findAcountByIdUseCaseSpy).toHaveBeenNthCalledWith(1, accountData.id);
        expect(repositorySpy).toHaveBeenNthCalledWith(1, expectedRes);
    });
});
