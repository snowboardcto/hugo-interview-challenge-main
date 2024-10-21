import { Router } from 'express';

import applicationRoutes from './applicationRoutes';

const routes = Router();

routes.use('/applications', applicationRoutes);

export default routes;
