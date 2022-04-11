import { Router } from 'express';
import { AccountController } from '../controllers/account.controller';

const accountRoutes = Router();

const accountController = new AccountController();

accountRoutes.post('/', accountController.store);

accountRoutes.get('/:id', accountController.findById);

accountRoutes.patch('/:id', accountController.update);

accountRoutes.post('/deposit/:id', accountController.deposit);

accountRoutes.post('/withdraw/:id', accountController.withdraw);

export { accountRoutes };
