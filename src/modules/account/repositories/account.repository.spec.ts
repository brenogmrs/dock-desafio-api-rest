import { getConnection } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { getDatabaseConfigConnectionQA } from '../../../config/database/connection';
import { AccountEntity } from '../entities/account.entity';
import { AccountRepository } from './account.repository';

describe('account repository context', () => {
    let accountRepository: AccountRepository;

    beforeEach(async () => {
        await getConnection().query('PRAGMA foreign_keys=OFF');
    });

    beforeAll(async () => {
        await getDatabaseConfigConnectionQA();

        accountRepository = new AccountRepository();
    });

    afterEach(async () => {
        await getConnection().manager.clear(AccountEntity);
        jest.resetAllMocks();
    });

    afterAll(async () => {
        await getConnection().close();
    });

    it('should create a account', async () => {
        const data = {
            number: '123456-7',
            agency: '1234',
            account_holder_id: uuid(),
        };

        const res = await accountRepository.createAndSave(data);

        expect(res).toEqual(expect.objectContaining(data));
    });

    it('should find a account by id', async () => {
        const data = {
            number: '123456-7',
            agency: '1234',
            account_holder_id: uuid(),
        };

        const createdAccount = await accountRepository.createAndSave(data);

        const foundAccount = await accountRepository.findById(createdAccount.id);

        expect(foundAccount!.id).toEqual(createdAccount.id);
    });

    it('should update account', async () => {
        const data = {
            number: '123456-7',
            agency: '1234',
            account_holder_id: uuid(),
        };

        const createdAccount = await accountRepository.createAndSave(data);

        const updateData = {
            ...createdAccount,
            active: false,
        };

        const foundAccount = await accountRepository.update(updateData);

        expect(foundAccount).toEqual(updateData);
    });
});
