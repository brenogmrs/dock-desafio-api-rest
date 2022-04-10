import { Router } from 'express';
import { AccountHolderController } from '../controllers/account-holder.controller';

const accountHolderRoutes = Router();

const accountHolderController = new AccountHolderController();

accountHolderRoutes.post('/', accountHolderController.store);

accountHolderRoutes.get('/:id', accountHolderController.findById);

accountHolderRoutes.get('/', accountHolderController.findAll);

accountHolderRoutes.put('/:id', accountHolderController.update);

accountHolderRoutes.delete('/:id', accountHolderController.delete);

export { accountHolderRoutes };
