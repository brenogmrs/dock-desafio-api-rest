import 'reflect-metadata';
import sinon from 'sinon';
import { v4 as uuid } from 'uuid';
import { AccountHolderRepository } from '../../repositories/account-holder.repository';
import { FindAccountHolderByIdUseCase } from './find-account-holder-by-id';

describe('Get customer by id use case context', () => {
    let customerRepository: sinon.SinonStubbedInstance<AccountHolderRepository>;
    let findAccountHolderByIdUseCase: FindAccountHolderByIdUseCase;

    beforeEach(() => {
        sinon.restore();
        customerRepository = sinon.createStubInstance(AccountHolderRepository);
        findAccountHolderByIdUseCase = new FindAccountHolderByIdUseCase(
            customerRepository,
        );
    });

    it('should find a customer by id', async () => {
        const data = {
            full_name: 'bilbo baggins',
            gender: 'M',
            city_id: uuid(),
            birth_date: '1996-06-06',
            id: uuid(),
        };

        const customerRepositorySpy = jest
            .spyOn(customerRepository, 'findById')
            .mockResolvedValue(<any>data);

        const expectedRes = {
            ...data,
        };

        const res = await findAccountHolderByIdUseCase.execute(data.id);

        expect(res).toEqual(expectedRes);
        expect(customerRepositorySpy).toHaveBeenNthCalledWith(1, data.id);
    });

    it('should not find a customer by id', async () => {
        expect.hasAssertions();

        jest.spyOn(customerRepository, 'findById').mockResolvedValue(<any>undefined);

        try {
            await findAccountHolderByIdUseCase.execute('data.id');
        } catch (error: any) {
            expect(error.message).toEqual('[Not found] - Account Holder not found.');
            expect(error.code).toEqual(404);
        }
    });
});
