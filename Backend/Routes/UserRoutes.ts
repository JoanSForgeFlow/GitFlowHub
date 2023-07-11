import express from "express";

const router = express.Router();

import { RegisterUser, PerfilUser } from "../Controllers/UserController.js";

//Tendremos las rutas de login y de display del perfil del user
router.post("/login", RegisterUser);
router.get("/profile/:id", PerfilUser);

export default router;
