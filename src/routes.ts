import { Router } from 'express';
import { accountHolderRoutes } from './modules/account-holder/routes/account-holder.routes';
import { accountRoutes } from './modules/account/routes/account.routes';

const routes = Router();

routes.use('/api/account-holder', accountHolderRoutes);
routes.use('/api/account', accountRoutes);

export { routes };
