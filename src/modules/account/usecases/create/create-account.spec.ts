import 'reflect-metadata';
import sinon from 'sinon';
import { v4 as uuid } from 'uuid';
import { AccountHolderRepository } from '../../../account-holder/repositories/account-holder.repository';
import { FindAccountHolderByCpfUseCase } from '../../../account-holder/usecases/find-by-cpf/find-account-holder-by-cpf';
import { AccountStatus } from '../../interfaces/account.interface';
import { AccountRepository } from '../../repositories/account.repository';
import { CreateAccountUseCase } from './create-account';

describe('Create account use case context', () => {
    let accountRepository: sinon.SinonStubbedInstance<AccountRepository>;
    let accountHolderRepository: sinon.SinonStubbedInstance<AccountHolderRepository>;

    let createAccountUseCase: CreateAccountUseCase;
    let findAccountHolderByCpfUseCase: FindAccountHolderByCpfUseCase;

    beforeEach(() => {
        accountRepository = sinon.createStubInstance(AccountRepository);
        accountHolderRepository = sinon.createStubInstance(AccountHolderRepository);

        findAccountHolderByCpfUseCase = new FindAccountHolderByCpfUseCase(
            accountHolderRepository,
        );

        createAccountUseCase = new CreateAccountUseCase(
            accountRepository,
            findAccountHolderByCpfUseCase,
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('instances should be defined', async () => {
        expect(accountRepository).toBeDefined();

        expect(createAccountUseCase).toBeDefined();
    });

    it('should create a account', async () => {
        const data = {
            agency: '123456-7',
            number: 1234,
            accountHolderCpf: '12312312345',
        };

        const accountHolderData = {
            id: uuid(),
            cpf: data.accountHolderCpf,
        };

        const expectedRes = {
            ...data,
            status: AccountStatus.AVAILABLE,
            active: true,
        };

        const accountRepositorySpy = jest
            .spyOn(accountRepository, 'createAndSave')
            .mockResolvedValue(<any>expectedRes);

        const findAccountHolderByCpfUseCaseSpy = jest
            .spyOn(findAccountHolderByCpfUseCase, 'execute')
            .mockResolvedValue(<any>accountHolderData);

        const res = await createAccountUseCase.execute(data);

        expect(res).toEqual(expectedRes);
        expect(accountRepositorySpy).toHaveBeenNthCalledWith(1, {
            ...expectedRes,
            account_holder_id: accountHolderData.id,
        });
        expect(findAccountHolderByCpfUseCaseSpy).toHaveBeenNthCalledWith(
            1,
            accountHolderData.cpf,
        );
    });
});
