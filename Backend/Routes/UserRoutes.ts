import express from "express";
import { errorChecked } from "../Middlewares/controllersMw.js";

const router = express.Router();

import { RegisterUser,LogInUser} from "../Controllers/UserController.js";

//Tendremos las rutas de login y de display del perfil del user
router.post("/sign-in", errorChecked(RegisterUser));
router.post("/login", errorChecked(LogInUser));
router.post("/confirm-account/:token", errorChecked(LogInUser));
router.post("/forget-password", errorChecked(LogInUser));
router.post("/forget-password/:token", errorChecked(LogInUser));

export default router;
