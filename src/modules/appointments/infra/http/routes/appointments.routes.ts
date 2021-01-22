import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import ensureAuthenticated from '@modules/Users/infra/http/middlewares/ensureAuthenticated';

import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsControllers from '../controllers/ProviderAppointmentsControllers';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsControllers = new ProviderAppointmentsControllers();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post('/', celebrate({
  [Segments.BODY]: {
    provider_id: Joi.string().uuid().required(),
    date: Joi.date(),
  },
}), appointmentsController.create)
appointmentsRouter.get('/me', providerAppointmentsControllers.index)

export default appointmentsRouter;
