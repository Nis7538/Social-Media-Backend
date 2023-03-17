import express from 'express';
import { getAllUser, login, signUp } from '../controllers/user_controllers';

const router = express.Router();

router.route('/').get(getAllUser);
router.route('/signup').post(signUp);
router.route('/login').post(login);

export default router;
