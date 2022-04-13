import 'reflect-metadata';
import sinon from 'sinon';
import { v4 as uuid } from 'uuid';
import { TransactionRepository } from '../../../transaction/repositories/transaction.repository';
import { FindAllTransactionsUseCase } from '../../../transaction/usecases/find-all/find-all-transactions';
import { AccountRepository } from '../../repositories/account.repository';
import { FindAccountByIdUseCase } from '../find-by-id/find-account-by-id';
import { AccountStatementUseCase } from './account-statement';

describe('Account Statement use case context', () => {
    let accountRepository: sinon.SinonStubbedInstance<AccountRepository>;
    let transactionRepository: sinon.SinonStubbedInstance<TransactionRepository>;

    let accountStatementUseCase: AccountStatementUseCase;
    let findAccountByIdUseCase: FindAccountByIdUseCase;
    let findAllTransactionsUseCase: FindAllTransactionsUseCase;

    beforeEach(() => {
        accountRepository = sinon.createStubInstance(AccountRepository);
        transactionRepository = sinon.createStubInstance(TransactionRepository);

        findAccountByIdUseCase = new FindAccountByIdUseCase(accountRepository);
        findAllTransactionsUseCase = new FindAllTransactionsUseCase(
            transactionRepository,
            findAccountByIdUseCase,
        );

        accountStatementUseCase = new AccountStatementUseCase(
            findAccountByIdUseCase,
            findAllTransactionsUseCase,
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('instances should be defined', async () => {
        expect(accountStatementUseCase).toBeDefined();
        expect(findAccountByIdUseCase).toBeDefined();
        expect(findAllTransactionsUseCase).toBeDefined();
    });

    it('should get the statement for certain period for account', async () => {
        const accountId = uuid();
        const filters = {
            startDateFilter: '2022-04-12',
            endDateFilter: '2022-04-13',
        };
        const transactions = [
            {
                account_id: accountId,
                operation_type: 'WITHDRAW',
                operation_date: '2022-04-12',
                amount: 100.0,
            },
            {
                account_id: accountId,
                operation_type: 'DEPOSIT',
                operation_date: '2022-04-13',
                amount: 40.0,
            },
        ];

        const accountData = {
            id: accountId,
            agency: '123456-7',
            number: 1234,
            balance: 200.0,
            active: false,
            status: 'AVAILABLE',
            account_holder: {
                full_name: 'ARAGORN',
            },
        };

        const expectedRes = {
            agency: accountData.agency,
            number: accountData.number,
            account_holder_name: accountData.account_holder.full_name,
            transactions,
            total_deposit: 40.0,
            total_withdraw: 100.0,
        };

        const findAccountByIdUseCaseSpy = jest
            .spyOn(findAccountByIdUseCase, 'execute')
            .mockResolvedValue(<any>accountData);

        const findAllTransactionsUseCaseSpy = jest
            .spyOn(findAllTransactionsUseCase, 'execute')
            .mockResolvedValue(<any>transactions);

        const statement = await accountStatementUseCase.execute(accountId, filters);

        expect(statement).toEqual(expectedRes);
        expect(findAccountByIdUseCaseSpy).toHaveBeenNthCalledWith(1, accountId);
        expect(findAllTransactionsUseCaseSpy).toHaveBeenNthCalledWith(
            1,
            accountId,
            filters,
        );
    });
});
