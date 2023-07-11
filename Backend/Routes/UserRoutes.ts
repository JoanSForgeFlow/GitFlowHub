import express from "express";

const router = express.Router();

import { RegisterUser } from "../Controllers/UserController.js";

//Tendremos las rutas de login y de display del perfil del user
router.post("/login", RegisterUser);

export default router;
