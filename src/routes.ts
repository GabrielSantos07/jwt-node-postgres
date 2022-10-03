import { Router } from 'express'
import { UserController } from './controllers/UserController'
import { authMiddleware } from './middleware/authMiddleware';

const routes = Router()

const userController = new UserController();

routes.post('/user', userController.create)
routes.post('/login', userController.login)

routes.use(authMiddleware)

routes.get('/profile', userController.getProfile)

export default routes