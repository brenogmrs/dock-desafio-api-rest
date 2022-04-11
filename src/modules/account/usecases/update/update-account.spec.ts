import 'reflect-metadata';
import sinon from 'sinon';
import { v4 as uuid } from 'uuid';
import { AccountStatus } from '../../interfaces/account.interface';
import { AccountRepository } from '../../repositories/account.repository';
import { FindAccountByIdUseCase } from '../find-by-id/find-account-by-id';
import { UpdateAccountUseCase } from './update-account';

describe('update account use case context', () => {
    let accountRepository: sinon.SinonStubbedInstance<AccountRepository>;
    let updateAccountUseCase: UpdateAccountUseCase;
    let findAccountByIdUseCase: FindAccountByIdUseCase;

    beforeEach(() => {
        sinon.restore();
        accountRepository = sinon.createStubInstance(AccountRepository);
        findAccountByIdUseCase = new FindAccountByIdUseCase(accountRepository);
        updateAccountUseCase = new UpdateAccountUseCase(
            accountRepository,
            findAccountByIdUseCase,
        );
    });
    it('should not update an account that is already inactive', async () => {
        expect.hasAssertions();

        const id = uuid();
        const updateData = {
            active: false,
        };

        const foundAccount = {
            active: false,
        };

        jest.spyOn(findAccountByIdUseCase, 'execute').mockResolvedValue(
            <any>foundAccount,
        );

        try {
            await updateAccountUseCase.execute(id, updateData);
        } catch (error: any) {
            expect(error.message).toEqual(
                '[Conflict] - This account is already inactive.',
            );
            expect(error.code).toEqual(409);
        }
    });

    it('should not update an account that is already blocked', async () => {
        expect.hasAssertions();

        const id = uuid();
        const updateData = {
            status: AccountStatus.BLOCKED,
        };

        const foundAccount = {
            status: 'BLOCKED',
        };

        jest.spyOn(findAccountByIdUseCase, 'execute').mockResolvedValue(
            <any>foundAccount,
        );

        try {
            await updateAccountUseCase.execute(id, updateData);
        } catch (error: any) {
            expect(error.message).toEqual(
                '[Conflict] - This account is already blocked.',
            );
            expect(error.code).toEqual(409);
        }
    });

    it('should properly update an account', async () => {
        expect.hasAssertions();

        const id = uuid();
        const updateData = {
            status: AccountStatus.AVAILABLE,
            active: true,
        };

        const foundAccount = {
            id,
            agency: '123456-7',
            number: 1234,
            balance: 200.0,
            active: false,
            status: 'BLOCKED',
        };

        const expectedRes = {
            ...foundAccount,
            ...updateData,
        };

        const findAccountByIdUseCaseSpy = jest
            .spyOn(findAccountByIdUseCase, 'execute')
            .mockResolvedValue(<any>foundAccount);

        const repositorySpy = jest
            .spyOn(accountRepository, 'update')
            .mockResolvedValue(<any>expectedRes);

        const response = await updateAccountUseCase.execute(id, updateData);

        expect(response).toEqual(expectedRes);
        expect(repositorySpy).toHaveBeenNthCalledWith(1, expectedRes);
        expect(findAccountByIdUseCaseSpy).toHaveBeenNthCalledWith(1, id);
    });
});
