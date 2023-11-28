import express from 'express';

import { deleteUser, getAllUsers, signin, signout, signup, userInfo } from '../controllers/userController.js';
import { requireSignin } from '../middlewares/index.js';
import { isRequestValidated, validateSigninRequest, validateSignupRequest } from '../validators/auth.js';

const userRouter = express.Router();

userRouter.post('/signup', validateSignupRequest, isRequestValidated, signup);
userRouter.post('/signin', validateSigninRequest, isRequestValidated, signin);
userRouter.post('/signout', signout);
userRouter.get('/details/:id', requireSignin ,userInfo); 
userRouter.get('/staff', requireSignin, getAllUsers); 
userRouter.delete("/staff/:id", deleteUser);

export default userRouter;