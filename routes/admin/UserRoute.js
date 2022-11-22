import express from "express";
// import verifyUserLogin from "../../middleware/admin/AuthUser";
import {
   getUsers,
   getUserById,
   updatedUser,
   deleteUser
} from '../../controller/admin/UserController';

const router = express.Router();

router.get('/user', getUsers);
router.get('/user/:id', getUserById);
router.patch('/user/:id', updatedUser);
router.delete('/user/:id', deleteUser);

export default router;