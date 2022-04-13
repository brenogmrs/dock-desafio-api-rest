import { getConnection } from 'typeorm';
import { getDatabaseConfigConnectionQA } from '../../../config/database/connection';
import { AccountHolderEntity } from '../entities/account-holder.entity';
import { AccountHolderRepository } from './account-holder.repository';

describe('account holder repository context', () => {
    let accountHolderRepository: AccountHolderRepository;

    beforeEach(async () => {
        await getConnection().query('PRAGMA foreign_keys=OFF');
    });

    beforeAll(async () => {
        await getDatabaseConfigConnectionQA();

        accountHolderRepository = new AccountHolderRepository();
    });

    afterEach(async () => {
        await getConnection().manager.clear(AccountHolderEntity);
        jest.resetAllMocks();
    });

    afterAll(async () => {
        await getConnection().close();
    });

    it('should create a account holder', async () => {
        const data = {
            full_name: 'bilbo baggins',
            cpf: '12312312345',
        };

        const res = await accountHolderRepository.createAndSave(data);

        expect(res).toEqual(expect.objectContaining(data));
    });

    it('should find a account holder by id', async () => {
        const data = {
            full_name: 'bilbo baggins',
            cpf: '12312312345',
        };

        const createdAccountHolder = await accountHolderRepository.createAndSave(
            data,
        );

        const foundAccountHolder = await accountHolderRepository.findById(
            createdAccountHolder.id,
        );

        expect(foundAccountHolder!.id).toEqual(createdAccountHolder.id);
    });

    it('should find a account holder by cpf', async () => {
        const data = {
            full_name: 'bilbo baggins',
            cpf: '12312312345',
        };

        const createdAccountHolder = await accountHolderRepository.createAndSave(
            data,
        );

        const foundAccountHolder = await accountHolderRepository.findByCpf(
            createdAccountHolder.cpf,
        );

        expect(foundAccountHolder!.cpf).toEqual(createdAccountHolder.cpf);
    });

    it('should update account holder', async () => {
        const data = {
            full_name: 'bilbo baggins',
            cpf: '12312312345',
        };

        const createdAccountHolder = await accountHolderRepository.createAndSave(
            data,
        );

        const updateData = {
            ...createdAccountHolder,
            full_name: 'gandalf the grey',
        };

        const foundAccountHolder = await accountHolderRepository.update(updateData);

        expect(foundAccountHolder).toEqual(updateData);
    });
});
