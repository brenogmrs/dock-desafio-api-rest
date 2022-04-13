import 'reflect-metadata';
import sinon from 'sinon';
import request from 'supertest';
import { container } from 'tsyringe';
import { v4 as uuid } from 'uuid';
import app from '../../../app';
import { AccountStatementUseCase } from '../usecases/account-statement/account-statement';
import { CreateAccountUseCase } from '../usecases/create/create-account';
import { DepositAmountUseCase } from '../usecases/deposit/deposit-amount';
import { FindAccountByIdUseCase } from '../usecases/find-by-id/find-account-by-id';
import { UpdateAccountUseCase } from '../usecases/update/update-account';
import { WithdrawAmountUseCase } from '../usecases/withdraw/withdraw-amount';

describe('Account routes tests', () => {
    let createAccountUseCase: sinon.SinonStubbedInstance<CreateAccountUseCase>;
    let findAccountByIdUseCase: sinon.SinonStubbedInstance<FindAccountByIdUseCase>;
    let updateAccountUseCase: sinon.SinonStubbedInstance<UpdateAccountUseCase>;
    let depositAmountUseCase: sinon.SinonStubbedInstance<DepositAmountUseCase>;
    let withdrawAmountUseCase: sinon.SinonStubbedInstance<WithdrawAmountUseCase>;
    let accountStatementUseCase: sinon.SinonStubbedInstance<AccountStatementUseCase>;

    beforeEach(() => {
        sinon.restore();

        createAccountUseCase = sinon.createStubInstance(CreateAccountUseCase);
        findAccountByIdUseCase = sinon.createStubInstance(FindAccountByIdUseCase);
        updateAccountUseCase = sinon.createStubInstance(UpdateAccountUseCase);
        depositAmountUseCase = sinon.createStubInstance(DepositAmountUseCase);
        withdrawAmountUseCase = sinon.createStubInstance(WithdrawAmountUseCase);
        accountStatementUseCase = sinon.createStubInstance(AccountStatementUseCase);
    });

    it('instances should be defined', async () => {
        expect(createAccountUseCase).toBeDefined();
        expect(findAccountByIdUseCase).toBeDefined();
        expect(updateAccountUseCase).toBeDefined();
        expect(depositAmountUseCase).toBeDefined();
        expect(withdrawAmountUseCase).toBeDefined();
        expect(accountStatementUseCase).toBeDefined();
    });

    describe('POST /api/account', () => {
        it('should create a account', async () => {
            jest.spyOn(container, 'resolve').mockReturnValue(createAccountUseCase);
            const data = {
                agency: '0001',
                number: '123456-7',
                accountHolderCpf: '12312312345',
            };
            const createCustomerUseCaseSpy = jest
                .spyOn(createAccountUseCase, 'execute')
                .mockResolvedValue(<any>data);

            const response = await request(app).post('/api/account').send(data);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(data);
            expect(createCustomerUseCaseSpy).toBeCalled();
        });

        it('Bad Request - should not create a account with invalid data', async () => {
            jest.spyOn(container, 'resolve').mockReturnValue(createAccountUseCase);
            const data = {
                agency: 1234,
                number: 12341234,
                accountHolderCpf: '1234',
            };
            const createCustomerUseCaseSpy = jest.spyOn(
                createAccountUseCase,
                'execute',
            );

            const response = await request(app).post('/api/account').send(data);

            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual([
                'agency must be a `string` type, but the final value was: `1234`.',
                'number must be a `string` type, but the final value was: `12341234`.',
                'accountHolderCpf must match the following: "/^\\d{3}\\d{3}\\d{3}\\d{2}$/"',
            ]);
            expect(createCustomerUseCaseSpy).not.toBeCalled();
        });

        it('should find a account by id', async () => {
            jest.spyOn(container, 'resolve').mockReturnValue(findAccountByIdUseCase);

            const id = uuid();

            const expectRes = {
                agency: '0001',
                number: '123456-7',
                balance: 123.45,
            };

            const findAccountByIdUseCaseSpy = jest
                .spyOn(findAccountByIdUseCase, 'execute')
                .mockResolvedValue(<any>expectRes);

            const response = await request(app).get(`/api/account/${id}`).send();
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expectRes);
            expect(findAccountByIdUseCaseSpy).toHaveBeenNthCalledWith(1, id);
        });

        it('Bad Request - should not find a account by id', async () => {
            jest.spyOn(container, 'resolve').mockReturnValue(findAccountByIdUseCase);

            const id = 'invali-id';

            const findAccountByIdUseCaseSpy = jest.spyOn(
                findAccountByIdUseCase,
                'execute',
            );

            const response = await request(app).get(`/api/account/${id}`).send();

            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual(['id must be a valid UUID']);
            expect(findAccountByIdUseCaseSpy).not.toBeCalled();
        });

        it('should get the account statement for the period', async () => {
            jest.spyOn(container, 'resolve').mockReturnValue(
                accountStatementUseCase,
            );

            const id = uuid();
            const dateFilters = {
                startDateFilter: '2022-04-12',
                endDateFilter: '2022-04-13',
            };

            const accountStatementUseCaseSpy = jest
                .spyOn(accountStatementUseCase, 'execute')
                .mockResolvedValue(<any>'data');

            const response = await request(app)
                .get(
                    `/api/account/statement/${id}?startDateFilter=2022-04-12&endDateFilter=2022-04-13`,
                )
                .send();
            expect(response.status).toBe(200);
            expect(accountStatementUseCaseSpy).toHaveBeenNthCalledWith(
                1,
                id,
                dateFilters,
            );
        });

        it('Bad Request - should not get the account statement for the period', async () => {
            jest.spyOn(container, 'resolve').mockReturnValue(
                accountStatementUseCase,
            );

            const id = 'invalid-id';
            const dateFilters = {
                startDateFilter: 'invalid-date',
                endDateFilter: 'invalid-date',
            };

            const accountStatementUseCaseSpy = jest.spyOn(
                accountStatementUseCase,
                'execute',
            );

            const response = await request(app)
                .get(
                    `/api/account/statement/${id}?startDateFilter=${dateFilters.startDateFilter}&endDateFilter=${dateFilters.endDateFilter}`,
                )
                .send();

            expect(response.status).toBe(400);

            expect(response.body.errors).toEqual([
                'startDateFilter must match the following: "/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/"',
                'endDateFilter must match the following: "/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/"',
            ]);
            expect(accountStatementUseCaseSpy).not.toBeCalled();
        });

        it('should update a account', async () => {
            jest.spyOn(container, 'resolve').mockReturnValue(updateAccountUseCase);

            const id = uuid();

            const data = {
                active: true,
                status: 'AVAILABLE',
            };

            const updateAccountUseCaseSpy = jest
                .spyOn(updateAccountUseCase, 'execute')
                .mockResolvedValue(<any>data);

            const response = await request(app)
                .patch(`/api/account/${id}`)
                .send(data);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(data);
            expect(updateAccountUseCaseSpy).toHaveBeenNthCalledWith(1, id, data);
        });

        it('Bad Request - should not update a account with invalid params', async () => {
            jest.spyOn(container, 'resolve').mockReturnValue(updateAccountUseCase);

            const id = uuid();

            const data = {
                active: 'true',
                status: 12341234,
            };

            const updateAccountUseCaseSpy = jest.spyOn(
                updateAccountUseCase,
                'execute',
            );

            const response = await request(app)
                .patch(`/api/account/${id}`)
                .send(data);

            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual([
                'active must be a `boolean` type, but the final value was: `"true"`.',
                'status must be a `string` type, but the final value was: `12341234`.',
            ]);
            expect(updateAccountUseCaseSpy).not.toBeCalled();
        });

        it('should deposit amount in an account', async () => {
            jest.spyOn(container, 'resolve').mockReturnValue(depositAmountUseCase);

            const id = uuid();

            const data = {
                amount: 200,
            };

            const depositAmountUseCaseSpy = jest
                .spyOn(depositAmountUseCase, 'execute')
                .mockResolvedValue(<any>data);

            const response = await request(app)
                .post(`/api/account/deposit/${id}`)
                .send(data);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(data);
            expect(depositAmountUseCaseSpy).toHaveBeenNthCalledWith(
                1,
                id,
                data.amount,
            );
        });

        it('Bad Request - should deposit amount in an account', async () => {
            jest.spyOn(container, 'resolve').mockReturnValue(depositAmountUseCase);

            const id = 'invalid-id';

            const data = {
                amount: -200,
            };

            const depositAmountUseCaseSpy = jest.spyOn(
                depositAmountUseCase,
                'execute',
            );

            const response = await request(app)
                .post(`/api/account/deposit/${id}`)
                .send(data);

            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual([
                'amount must be a positive number',
            ]);
            expect(depositAmountUseCaseSpy).not.toBeCalled();
        });

        it('should withdraw amount from an account', async () => {
            jest.spyOn(container, 'resolve').mockReturnValue(withdrawAmountUseCase);

            const id = uuid();

            const data = {
                amount: 200,
            };

            const withdrawAmountUseCaseSpy = jest
                .spyOn(withdrawAmountUseCase, 'execute')
                .mockResolvedValue(<any>data);

            const response = await request(app)
                .post(`/api/account/withdraw/${id}`)
                .send(data);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(data);
            expect(withdrawAmountUseCaseSpy).toHaveBeenNthCalledWith(
                1,
                id,
                data.amount,
            );
        });

        it('Bad Request - should withdraw amount in an account', async () => {
            jest.spyOn(container, 'resolve').mockReturnValue(withdrawAmountUseCase);

            const id = 'invalid-id';

            const data = {
                amount: -200,
            };

            const withdrawAmountUseCaseSpy = jest.spyOn(
                withdrawAmountUseCase,
                'execute',
            );

            const response = await request(app)
                .post(`/api/account/withdraw/${id}`)
                .send(data);

            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual([
                'amount must be a positive number',
            ]);
            expect(withdrawAmountUseCaseSpy).not.toBeCalled();
        });
    });
});
