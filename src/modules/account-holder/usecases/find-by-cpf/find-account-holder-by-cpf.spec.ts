import 'reflect-metadata';
import sinon from 'sinon';
import { v4 as uuid } from 'uuid';
import { AccountHolderRepository } from '../../repositories/account-holder.repository';
import { FindAccountHolderByCpfUseCase } from './find-account-holder-by-cpf';

describe('Get account holder by id use case context', () => {
    let accountHolderRepository: sinon.SinonStubbedInstance<AccountHolderRepository>;
    let findAccountHolderByIdUseCase: FindAccountHolderByCpfUseCase;

    beforeEach(() => {
        sinon.restore();
        accountHolderRepository = sinon.createStubInstance(AccountHolderRepository);
        findAccountHolderByIdUseCase = new FindAccountHolderByCpfUseCase(
            accountHolderRepository,
        );
    });

    it('should find a account holder by id', async () => {
        const id = uuid();
        const data = {
            full_name: 'bilbo baggins',
            birth_date: '12312312345',
        };

        const accountHolderRepositorySpy = jest
            .spyOn(accountHolderRepository, 'findByCpf')
            .mockResolvedValue(<any>data);

        const expectedRes = {
            ...data,
        };

        const res = await findAccountHolderByIdUseCase.execute(id);

        expect(res).toEqual(expectedRes);
        expect(accountHolderRepositorySpy).toHaveBeenNthCalledWith(1, id);
    });

    it('should not find a account holder by id', async () => {
        expect.hasAssertions();

        jest.spyOn(accountHolderRepository, 'findByCpf').mockResolvedValue(
            <any>undefined,
        );

        try {
            await findAccountHolderByIdUseCase.execute('data.id');
        } catch (error: any) {
            expect(error.message).toEqual(
                '[Not found] - Account holder not found for this cpf.',
            );
            expect(error.code).toEqual(404);
        }
    });
});
