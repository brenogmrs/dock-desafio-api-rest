import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { idParamSchema } from '../../../common/validators';
import { CreateAccountUseCase } from '../usecases/create/create-account';
import { DepositAmountUseCase } from '../usecases/deposit/deposit-amount';
import { FindAccountByIdUseCase } from '../usecases/find-by-id/find-account-by-id';
import { UpdateAccountUseCase } from '../usecases/update/update-account';
import { WithdrawAmountUseCase } from '../usecases/withdraw/withdraw-amount';
import {
    createAccountSchema,
    depositOrWithdrawAmountSchema,
    updateAccountSchema,
} from '../utils/validators';

export class AccountController {
    public async store(request: Request, response: Response): Promise<Response> {
        await createAccountSchema.validate(request.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        const { body } = request;

        const createAccountUseCase = container.resolve(CreateAccountUseCase);

        const result = await createAccountUseCase.execute(body);

        return response.status(201).json(result);
    }

    public async findById(request: Request, response: Response): Promise<Response> {
        await idParamSchema.validate(request.params, {
            abortEarly: false,
            stripUnknown: true,
        });

        const { id } = request.params;

        const findAccountById = container.resolve(FindAccountByIdUseCase);

        const { number, agency, balance } = await findAccountById.execute(id);

        return response.status(200).json({ number, agency, balance });
    }

    public async update(request: Request, response: Response): Promise<Response> {
        await updateAccountSchema.validate(request.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        await idParamSchema.validate(request.params, {
            abortEarly: false,
            stripUnknown: true,
        });

        const { id } = request.params;
        const updateBody = request.body;

        const updateAccountUseCase = container.resolve(UpdateAccountUseCase);

        const updatedAccount = await updateAccountUseCase.execute(id, updateBody);

        return response.status(200).json(updatedAccount);
    }

    public async deposit(request: Request, response: Response): Promise<Response> {
        await depositOrWithdrawAmountSchema.validate(request.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        await idParamSchema.validate(request.params, {
            abortEarly: false,
            stripUnknown: true,
        });

        const { id } = request.params;
        const { amount } = request.body;

        const depositAmountUseCase = container.resolve(DepositAmountUseCase);

        const updatedAccount = await depositAmountUseCase.execute(id, amount);

        return response.status(200).json(updatedAccount);
    }

    public async withdraw(request: Request, response: Response): Promise<Response> {
        await depositOrWithdrawAmountSchema.validate(request.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        await idParamSchema.validate(request.params, {
            abortEarly: false,
            stripUnknown: true,
        });

        const { id } = request.params;
        const { amount } = request.body;

        const withdrawAmountUseCase = container.resolve(WithdrawAmountUseCase);

        const updatedAccount = await withdrawAmountUseCase.execute(id, amount);

        return response.status(200).json(updatedAccount);
    }
}
