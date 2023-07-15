import express from "express";
import { errorChecked } from "../Middlewares/controllersMw.js";

const router = express.Router();

import {
  RegisterUser,
  confirmUser,
  LogInUser,
  forgetRequest,
  checkToken,
  newPassword,
} from "../Controllers/UserController.js";

//Tendremos las rutas de login y de display del perfil del user
router.post("/sign-in", errorChecked(RegisterUser));
router.post("/login", errorChecked(LogInUser));
router.get("/confirm-account/:token", errorChecked(confirmUser));
router.post("/forget-password", errorChecked(forgetRequest));
router
  .route("/forget-password/:token")
  .get(errorChecked(checkToken))
  .post(errorChecked(newPassword));

export default router;
