import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { idParamSchema } from '../../../common/validators';
import { CreateAccountHolderUseCase } from '../usecases/create/create-account-holder';
import { DeleteAccountHolderUseCase } from '../usecases/delete/delete-account-holder';
import { FindAllAccountHoldersUseCase } from '../usecases/find-all/find-all-account-holders';
import { FindAccountHolderByIdUseCase } from '../usecases/find-by-id/find-account-holder-by-id';
import { UpdateAccountHolderUseCase } from '../usecases/update/update-account-holder';

import {
    createAccountHolderSchema,
    updateAccountHolderSchema,
} from '../utils/validators';

export class AccountHolderController {
    public async store(request: Request, response: Response): Promise<Response> {
        await createAccountHolderSchema.validate(request.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        const { body } = request;

        const createAccountHolderUseCase = container.resolve(
            CreateAccountHolderUseCase,
        );

        const result = await createAccountHolderUseCase.execute(body);

        return response.status(201).json(result);
    }

    public async findById(request: Request, response: Response): Promise<Response> {
        await idParamSchema.validate(request.params, {
            abortEarly: false,
            stripUnknown: true,
        });

        const { id } = request.params;

        const findAccountHolderById = container.resolve(
            FindAccountHolderByIdUseCase,
        );

        const foundAccountHolder = await findAccountHolderById.execute(id);

        return response.status(200).json(foundAccountHolder);
    }

    public async findAll(request: Request, response: Response): Promise<Response> {
        const findAllAccountHolders = container.resolve(
            FindAllAccountHoldersUseCase,
        );

        const foundAccountHolder = await findAllAccountHolders.execute();

        return response.status(200).json(foundAccountHolder);
    }

    public async update(request: Request, response: Response): Promise<Response> {
        await updateAccountHolderSchema.validate(request.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        await idParamSchema.validate(request.params, {
            abortEarly: false,
            stripUnknown: true,
        });

        const { id } = request.params;
        const updateBody = request.body;

        const updateAccountHolderUseCase = container.resolve(
            UpdateAccountHolderUseCase,
        );

        const updatedAccountHolder = await updateAccountHolderUseCase.execute(
            id,
            updateBody,
        );

        return response.status(200).json(updatedAccountHolder);
    }

    public async delete(request: Request, response: Response): Promise<Response> {
        await idParamSchema.validate(request.params, {
            abortEarly: false,
            stripUnknown: true,
        });

        const { id } = request.params;

        const deleteAccountHolderUseCase = container.resolve(
            DeleteAccountHolderUseCase,
        );

        await deleteAccountHolderUseCase.execute(id);

        return response.status(204).json();
    }
}
