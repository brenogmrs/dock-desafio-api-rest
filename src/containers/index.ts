import { container, delay } from 'tsyringe';
import { AccountHolderRepository } from '../modules/account-holder/repositories/account-holder.repository';
import { IAccountHolderRepository } from '../modules/account-holder/repositories/interfaces/account-holder.repository';
import { CreateAccountHolderUseCase } from '../modules/account-holder/usecases/create/create-account-holder';
import { DeleteAccountHolderUseCase } from '../modules/account-holder/usecases/delete/delete-account-holder';
import { FindAllAccountHoldersUseCase } from '../modules/account-holder/usecases/find-all/find-all-account-holders';
import { FindAccountHolderByCpfUseCase } from '../modules/account-holder/usecases/find-by-cpf/find-account-holder-by-cpf';
import { FindAccountHolderByIdUseCase } from '../modules/account-holder/usecases/find-by-id/find-account-holder-by-id';
import { UpdateAccountHolderUseCase } from '../modules/account-holder/usecases/update/update-account-holder';
import { AccountRepository } from '../modules/account/repositories/account.repository';
import { IAccountRepository } from '../modules/account/repositories/account.repository.interface';
import { AccountStatementUseCase } from '../modules/account/usecases/account-statement/account-statement';
import { CreateAccountUseCase } from '../modules/account/usecases/create/create-account';
import { DepositAmountUseCase } from '../modules/account/usecases/deposit/deposit-amount';
import { FindAccountByIdUseCase } from '../modules/account/usecases/find-by-id/find-account-by-id';
import { UpdateAccountUseCase } from '../modules/account/usecases/update/update-account';
import { WithdrawAmountUseCase } from '../modules/account/usecases/withdraw/withdraw-amount';
import { ITransactionRepository } from '../modules/transaction/repositories/transaction.repository.interface';
import { TransactionRepository } from '../modules/transaction/repositories/transaction.repository';
import { CreateTransactionUseCase } from '../modules/transaction/usecases/create/create-transaction';
import { FindAllTransactionsUseCase } from '../modules/transaction/usecases/find-all/find-all-transactions';

container.registerSingleton<IAccountHolderRepository>(
    'AccountHolderRepository',
    delay(() => AccountHolderRepository),
);

container.registerSingleton<IAccountRepository>(
    'AccountRepository',
    delay(() => AccountRepository),
);

container.registerSingleton<ITransactionRepository>(
    'TransactionRepository',
    delay(() => TransactionRepository),
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

container.registerSingleton<CreateAccountUseCase>(
    'CreateAccountUseCase',
    CreateAccountUseCase,
);

container.registerSingleton<DepositAmountUseCase>(
    'DepositAmountUseCase',
    DepositAmountUseCase,
);

container.registerSingleton<AccountStatementUseCase>(
    'AccountStatementUseCase',
    AccountStatementUseCase,
);

container.registerSingleton<FindAccountByIdUseCase>(
    'FindAccountByIdUseCase',
    FindAccountByIdUseCase,
);

container.registerSingleton<UpdateAccountUseCase>(
    'UpdateAccountUseCase',
    UpdateAccountUseCase,
);

container.registerSingleton<WithdrawAmountUseCase>(
    'WithdrawAmountUseCase',
    WithdrawAmountUseCase,
);

container.registerSingleton<CreateTransactionUseCase>(
    'CreateTransactionUseCase',
    CreateTransactionUseCase,
);

container.registerSingleton<FindAllTransactionsUseCase>(
    'FindAllTransactionsUseCase',
    FindAllTransactionsUseCase,
);
