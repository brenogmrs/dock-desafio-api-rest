import 'reflect-metadata';
import sinon from 'sinon';
import { v4 as uuid } from 'uuid';
import { AccountHolderRepository } from '../../repositories/account-holder.repository';
import { FindAccountHolderByIdUseCase } from '../find-by-id/find-account-holder-by-id';
import { DeleteAccountHolderUseCase } from './delete-account-holder';

describe('delete account holder use case context', () => {
    let accountHolderRepository: sinon.SinonStubbedInstance<AccountHolderRepository>;
    let deleteAccountHolderUseCase: DeleteAccountHolderUseCase;
    let getAccountHolderByIdUseCase: FindAccountHolderByIdUseCase;

    beforeEach(() => {
        sinon.restore();
        accountHolderRepository = sinon.createStubInstance(AccountHolderRepository);

        getAccountHolderByIdUseCase = new FindAccountHolderByIdUseCase(
            accountHolderRepository,
        );
        deleteAccountHolderUseCase = new DeleteAccountHolderUseCase(
            accountHolderRepository,
            getAccountHolderByIdUseCase,
        );
    });
    it('should delete a account holder', async () => {
        const id = uuid();

        const data = {
            full_name: 'bilbo baggins',
            cpf: '12312312345',
        };

        const getAccountHolderByIdUseCaseSpy = jest
            .spyOn(getAccountHolderByIdUseCase, 'execute')
            .mockResolvedValue(<any>data);

        const accountHolderRepositorySpy = jest
            .spyOn(accountHolderRepository, 'delete')
            .mockResolvedValue(<any>undefined);

        const deleteAccountHolderUseCaseSpy = jest.spyOn(
            deleteAccountHolderUseCase,
            'execute',
        );

        await deleteAccountHolderUseCase.execute(id);

        expect(deleteAccountHolderUseCaseSpy).toHaveBeenNthCalledWith(1, id);
        expect(getAccountHolderByIdUseCaseSpy).toHaveBeenNthCalledWith(1, id);
        expect(accountHolderRepositorySpy).toHaveBeenNthCalledWith(1, data);
    });
});
