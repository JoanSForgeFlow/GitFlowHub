import express from "express";
import { errorChecked } from "../Middlewares/controllersMw.js";
import checkAuth from "../Helpers/checkAuth.js";

const router = express.Router();

import {
  RegisterUser,
  confirmUser,
  LogInUser,
  forgetRequest,
  checkToken,
  newPassword,
  userProfile
} from "../Controllers/UserController.js";

import {
  getPRsByCompany,
  getAndUpdateAvatarUrl,
  getCompanyUsers,
  assignPR
} from '../Controllers/PRDashboardController.js';

//Tendremos las rutas de login y de display del perfil del user
router.post("/sign-in", errorChecked(RegisterUser));
router.post("/login", errorChecked(LogInUser));
router.get("/confirm-account/:token", confirmUser);
router.post("/forget-password", errorChecked(forgetRequest));
router
  .route("/forget-password/:token")
  .get(errorChecked(checkToken))
  .post(errorChecked(newPassword));
router.get("/profile", checkAuth, errorChecked(userProfile));

router.get('/prs',checkAuth, errorChecked(getPRsByCompany));
router.get('/update-avatar/:githubUser', checkAuth,errorChecked(getAndUpdateAvatarUrl));
router.get('/prs/users',checkAuth,errorChecked(getCompanyUsers))
router.get('/pr/assign',checkAuth,errorChecked(assignPR))

export default router;
