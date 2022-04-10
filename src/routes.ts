import { Router } from 'express';
import { accountHolderRoutes } from './modules/account-holder/routes/account-holder.routes';

const routes = Router();

routes.use('/api/account-holder', accountHolderRoutes);

export { routes };
