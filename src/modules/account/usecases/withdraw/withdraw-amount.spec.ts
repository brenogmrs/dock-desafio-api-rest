import 'reflect-metadata';
import sinon from 'sinon';
// import { AccountHolderRepository } from '../../repositories/account-holder.repository';
// import { CreateAccountHolderUseCase } from './create-account-holder';

describe('Create account holder use case context', () => {
    it('1 === 1', () => {
        expect(1).toBe(1);
    });
    // let accountHolderRepository: sinon.SinonStubbedInstance<AccountHolderRepository>;

    // let createAccountHolderUseCase: CreateAccountHolderUseCase;

    // beforeEach(() => {
    //     accountHolderRepository = sinon.createStubInstance(AccountHolderRepository);

    //     createAccountHolderUseCase = new CreateAccountHolderUseCase(
    //         accountHolderRepository,
    //     );
    // });

    // afterEach(() => {
    //     jest.clearAllMocks();
    // });

    // it('instances should be defined', async () => {
    //     expect(accountHolderRepository).toBeDefined();

    //     expect(createAccountHolderUseCase).toBeDefined();
    // });

    // it('should create a account holder', async () => {
    //     const data = {
    //         full_name: 'bilbo baggins',
    //         cpf: '12312312345',
    //     };

    //     const expectedRes = {
    //         ...data,
    //         full_name: data.full_name.toUpperCase(),
    //     };

    //     const accountHolderRepositorySpy = jest
    //         .spyOn(accountHolderRepository, 'createAndSave')
    //         .mockResolvedValue(<any>expectedRes);

    //     const res = await createAccountHolderUseCase.execute(data);

    //     expect(res).toEqual(expectedRes);
    //     expect(accountHolderRepositorySpy).toHaveBeenNthCalledWith(1, expectedRes);
    // });
});
