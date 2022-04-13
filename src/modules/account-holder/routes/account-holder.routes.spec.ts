import 'reflect-metadata';
import sinon from 'sinon';
import request from 'supertest';
import { container } from 'tsyringe';
import { v4 as uuid } from 'uuid';
import app from '../../../app';
import { CreateAccountHolderUseCase } from '../usecases/create/create-account-holder';
import { DeleteAccountHolderUseCase } from '../usecases/delete/delete-account-holder';
import { FindAllAccountHoldersUseCase } from '../usecases/find-all/find-all-account-holders';
import { FindAccountHolderByIdUseCase } from '../usecases/find-by-id/find-account-holder-by-id';
import { UpdateAccountHolderUseCase } from '../usecases/update/update-account-holder';

describe('Account routes tests', () => {
    let createAccountHolderUseCase: CreateAccountHolderUseCase;
    let findAccountHolderByIdUseCase: FindAccountHolderByIdUseCase;
    let findAllAccountHoldersUseCase: FindAllAccountHoldersUseCase;
    let updateAccountHolderUseCase: UpdateAccountHolderUseCase;
    let deleteAccountHolderUseCase: DeleteAccountHolderUseCase;

    beforeEach(() => {
        sinon.restore();

        createAccountHolderUseCase = sinon.createStubInstance(
            CreateAccountHolderUseCase,
        );
        findAccountHolderByIdUseCase = sinon.createStubInstance(
            FindAccountHolderByIdUseCase,
        );
        findAllAccountHoldersUseCase = sinon.createStubInstance(
            FindAllAccountHoldersUseCase,
        );
        updateAccountHolderUseCase = sinon.createStubInstance(
            UpdateAccountHolderUseCase,
        );
        deleteAccountHolderUseCase = sinon.createStubInstance(
            DeleteAccountHolderUseCase,
        );
    });

    it('instances should be defined', async () => {
        expect(createAccountHolderUseCase).toBeDefined();
        expect(findAccountHolderByIdUseCase).toBeDefined();
        expect(findAllAccountHoldersUseCase).toBeDefined();
        expect(updateAccountHolderUseCase).toBeDefined();
        expect(deleteAccountHolderUseCase).toBeDefined();
    });

    describe('POST /api/account-holder', () => {
        it('should create a account holder', async () => {
            jest.spyOn(container, 'resolve').mockReturnValue(
                createAccountHolderUseCase,
            );
            const data = {
                full_name: 'breno',
                cpf: '12312312345',
            };
            const createCustomerUseCaseSpy = jest
                .spyOn(createAccountHolderUseCase, 'execute')
                .mockResolvedValue(<any>data);

            const response = await request(app)
                .post('/api/account-holder')
                .send(data);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(data);
            expect(createCustomerUseCaseSpy).toBeCalled();
        });

        it('Bad Request - should not create a account with invalid data', async () => {
            jest.spyOn(container, 'resolve').mockReturnValue(
                createAccountHolderUseCase,
            );
            const data = {
                full_name: 123123,
                cpf: '12312315',
            };
            const ccreateAccountHolderUseCaseSpy = jest.spyOn(
                createAccountHolderUseCase,
                'execute',
            );

            const response = await request(app)
                .post('/api/account-holder')
                .send(data);

            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual([
                'full_name must be a `string` type, but the final value was: `123123`.',
                'cpf must match the following: "/^\\d{3}\\d{3}\\d{3}\\d{2}$/"',
            ]);
            expect(ccreateAccountHolderUseCaseSpy).not.toBeCalled();
        });

        it('should find a account holder by id', async () => {
            jest.spyOn(container, 'resolve').mockReturnValue(
                findAccountHolderByIdUseCase,
            );

            const id = uuid();

            const expectRes = {
                agency: '0001',
                number: '123456-7',
                balance: 123.45,
            };

            const findAccountHolderByIdUseCaseSpy = jest
                .spyOn(findAccountHolderByIdUseCase, 'execute')
                .mockResolvedValue(<any>expectRes);

            const response = await request(app)
                .get(`/api/account-holder/${id}`)
                .send();
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expectRes);
            expect(findAccountHolderByIdUseCaseSpy).toHaveBeenNthCalledWith(1, id);
        });

        it('should find aall account holders', async () => {
            jest.spyOn(container, 'resolve').mockReturnValue(
                findAccountHolderByIdUseCase,
            );

            const expectRes = [
                {
                    agency: '0001',
                    number: '123456-7',
                    balance: 123.45,
                },
            ];

            const findAccountHolderByIdUseCaseSpy = jest
                .spyOn(findAccountHolderByIdUseCase, 'execute')
                .mockResolvedValue(<any>expectRes);

            const response = await request(app).get(`/api/account-holder/`).send();
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expectRes);
            expect(findAccountHolderByIdUseCaseSpy).toHaveBeenCalled();
        });

        it('Bad Request - should not find a account holder by id', async () => {
            jest.spyOn(container, 'resolve').mockReturnValue(
                findAccountHolderByIdUseCase,
            );

            const id = 'invali-id';

            const findAccountHolderByIdUseCaseSpy = jest.spyOn(
                findAccountHolderByIdUseCase,
                'execute',
            );

            const response = await request(app)
                .get(`/api/account-holder/${id}`)
                .send();

            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual(['id must be a valid UUID']);
            expect(findAccountHolderByIdUseCaseSpy).not.toBeCalled();
        });

        it('should update a account holder', async () => {
            jest.spyOn(container, 'resolve').mockReturnValue(
                updateAccountHolderUseCase,
            );

            const id = uuid();

            const data = {
                full_name: 'Aragorn',
            };

            const updateAccountHolderUseCaseSpy = jest
                .spyOn(updateAccountHolderUseCase, 'execute')
                .mockResolvedValue(<any>data);

            const response = await request(app)
                .patch(`/api/account-holder/${id}`)
                .send(data);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(data);
            expect(updateAccountHolderUseCaseSpy).toHaveBeenNthCalledWith(
                1,
                id,
                data,
            );
        });

        it('Bad Request - should not update a account with invalid params', async () => {
            jest.spyOn(container, 'resolve').mockReturnValue(
                updateAccountHolderUseCase,
            );

            const id = uuid();

            const data = {
                full_name: 1234,
            };

            const updateAccountHolderUseCaseSpy = jest.spyOn(
                updateAccountHolderUseCase,
                'execute',
            );

            const response = await request(app)
                .patch(`/api/account-holder/${id}`)
                .send(data);

            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual([
                'full_name must be a `string` type, but the final value was: `1234`.',
            ]);
            expect(updateAccountHolderUseCaseSpy).not.toBeCalled();
        });

        it('should delete a account holder', async () => {
            jest.spyOn(container, 'resolve').mockReturnValue(
                deleteAccountHolderUseCase,
            );

            const id = uuid();

            const deleteAccountHolderUseCaseSpy = jest
                .spyOn(deleteAccountHolderUseCase, 'execute')
                .mockResolvedValue(<any>'data');

            const response = await request(app)
                .delete(`/api/account-holder/${id}`)
                .send();

            expect(response.status).toBe(204);
            expect(deleteAccountHolderUseCaseSpy).toHaveBeenNthCalledWith(1, id);
        });

        it('Bad Request - should delete a account holder', async () => {
            jest.spyOn(container, 'resolve').mockReturnValue(
                deleteAccountHolderUseCase,
            );

            const id = 'invalid-id';

            const deleteAccountHolderUseCaseSpy = jest
                .spyOn(deleteAccountHolderUseCase, 'execute')
                .mockResolvedValue(<any>'data');

            const response = await request(app)
                .delete(`/api/account-holder/${id}`)
                .send();

            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual(['id must be a valid UUID']);
            expect(deleteAccountHolderUseCaseSpy).not.toBeCalled();
        });
    });
});
