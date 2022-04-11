import 'reflect-metadata';
import sinon from 'sinon';
import { v4 as uuid } from 'uuid';
import { AccountRepository } from '../../repositories/account.repository';
import { FindAccountByIdUseCase } from './find-account-by-id';

describe('Get account  by id use case context', () => {
    let accountRepository: sinon.SinonStubbedInstance<AccountRepository>;
    let findAccountByIdUseCase: FindAccountByIdUseCase;

    beforeEach(() => {
        sinon.restore();
        accountRepository = sinon.createStubInstance(AccountRepository);
        findAccountByIdUseCase = new FindAccountByIdUseCase(accountRepository);
    });

    it('should find a account  by id', async () => {
        const data = {
            id: uuid(),
            agency: '123456-7',
            number: 1234,
            balance: 200.0,
            active: false,
            status: 'AVAILABLE',
        };

        const accountRepositorySpy = jest
            .spyOn(accountRepository, 'findById')
            .mockResolvedValue(<any>data);

        const expectedRes = {
            ...data,
        };

        const res = await findAccountByIdUseCase.execute(data.id);

        expect(res).toEqual(expectedRes);
        expect(accountRepositorySpy).toHaveBeenNthCalledWith(1, data.id);
    });

    it('should not find a account  by id', async () => {
        expect.hasAssertions();

        jest.spyOn(accountRepository, 'findById').mockResolvedValue(<any>undefined);

        try {
            await findAccountByIdUseCase.execute('data.id');
        } catch (error: any) {
            expect(error.message).toEqual('[Not found] - Account not found.');
            expect(error.code).toEqual(404);
        }
    });
});
