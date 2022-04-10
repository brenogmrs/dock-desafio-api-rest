import { container, delay } from 'tsyringe';
import { AccountHolderRepository } from '../modules/account-holder/repositories/account-holder.repository';
import { IAccountHolderRepository } from '../modules/account-holder/repositories/interface/account-holder.repository';
import { CreateAccountHolderUseCase } from '../modules/account-holder/usecases/create/create-account-holder';
import { DeleteAccountHolderUseCase } from '../modules/account-holder/usecases/delete/delete-account-holder';
import { FindAllAccountHoldersUseCase } from '../modules/account-holder/usecases/find-all/find-all-account-holders';
import { FindAccountHolderByCpfUseCase } from '../modules/account-holder/usecases/find-by-cpf/find-account-holder-by-cpf';
import { FindAccountHolderByIdUseCase } from '../modules/account-holder/usecases/find-by-id/find-account-holder-by-id';
import { UpdateAccountHolderUseCase } from '../modules/account-holder/usecases/update/update-account-holder';

container.registerSingleton<IAccountHolderRepository>(
    'AccountHolderRepository',
    delay(() => AccountHolderRepository),
);

container.registerSingleton<CreateAccountHolderUseCase>(
    'CreateAccountHolderUseCase',
    CreateAccountHolderUseCase,
);

container.registerSingleton<FindAllAccountHoldersUseCase>(
    'FindAllAccountHoldersUseCase',
    FindAllAccountHoldersUseCase,
);

container.registerSingleton<FindAccountHolderByIdUseCase>(
    'FindAccountHolderByIdUseCase',
    FindAccountHolderByIdUseCase,
);

container.registerSingleton<FindAccountHolderByCpfUseCase>(
    'FindAccountHolderByCpfUseCase',
    FindAccountHolderByCpfUseCase,
);

container.registerSingleton<UpdateAccountHolderUseCase>(
    'UpdateAccountHolderUseCase',
    UpdateAccountHolderUseCase,
);

container.registerSingleton<DeleteAccountHolderUseCase>(
    'DeleteAccountHolderUseCase',
    DeleteAccountHolderUseCase,
);
