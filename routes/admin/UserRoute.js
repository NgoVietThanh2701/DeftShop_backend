import express from "express";
import {
   getUsers,
   getUserById,
   createUser,
   updatedUser,
   deleteUser
} from '../../controller/UserController';

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.patch('/users/:id', updatedUser);
router.delete('/users/:id', deleteUser);

export default router;