import express from "express";
import { errorChecked } from "../Middlewares/controllersMw.js";

const router = express.Router();

import { RegisterUser,LogInUser} from "../Controllers/UserController.js";

//Tendremos las rutas de login y de display del perfil del user
router.post("/sign-in", RegisterUser);
router.post("/login", LogInUser);

export default router;
