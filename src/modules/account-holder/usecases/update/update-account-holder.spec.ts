import 'reflect-metadata';
import sinon from 'sinon';
import { v4 as uuid } from 'uuid';
import { AccountHolderRepository } from '../../repositories/account-holder.repository';
import { FindAccountHolderByIdUseCase } from '../find-by-id/find-account-holder-by-id';
import { UpdateAccountHolderUseCase } from './update-account-holder';

describe('update account holder use case context', () => {
    let accountHolderRepository: sinon.SinonStubbedInstance<AccountHolderRepository>;
    let updateAccountHolderUseCase: UpdateAccountHolderUseCase;
    let findAccountHolderByIdUseCase: FindAccountHolderByIdUseCase;

    beforeEach(() => {
        sinon.restore();
        accountHolderRepository = sinon.createStubInstance(AccountHolderRepository);

        findAccountHolderByIdUseCase = new FindAccountHolderByIdUseCase(
            accountHolderRepository,
        );
        updateAccountHolderUseCase = new UpdateAccountHolderUseCase(
            accountHolderRepository,
            findAccountHolderByIdUseCase,
        );
    });
    it('should update a account holder', async () => {
        const id = uuid();

        const data = {
            full_name: 'bilbo baggins',
        };

        const updateBody = {
            full_name: 'Gimli',
        };

        const expectedRes = {
            ...data,
            ...updateBody,
        };

        const findAccountHolderByIdUseCaseSpy = jest
            .spyOn(findAccountHolderByIdUseCase, 'execute')
            .mockResolvedValue(<any>data);

        const accountHolderRepositorySpy = jest
            .spyOn(accountHolderRepository, 'update')
            .mockResolvedValue(<any>expectedRes);

        const res = await updateAccountHolderUseCase.execute(id, updateBody);

        expect(res).toEqual(expectedRes);
        expect(findAccountHolderByIdUseCaseSpy).toHaveBeenNthCalledWith(1, id);
        expect(accountHolderRepositorySpy).toHaveBeenNthCalledWith(1, expectedRes);
    });
});
