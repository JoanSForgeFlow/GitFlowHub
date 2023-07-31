import prisma from "../Middlewares/prisma-client.js";
import bcrypt from "bcryptjs";
import generarId from "../Helpers/generarId.js";
import generarJWT from "../Helpers/generarJWT.js";
import { signInEmail, newPasswordEmail } from "../Helpers/emails.js";

const RegisterUser = async (req, res) => {
  const data = req.body;

  const { password } = data;
  const hashedPassword = await bcrypt.hash(password, 10);

  data.password = hashedPassword;

  const createUser = await prisma.user.create({ data });

  //Generate a token that will be used to confirm account

  const token = generarId();

  const updatedUser = await prisma.user.update({
    where: { id: createUser.id },
    data: { token },
  });

  // Insert send email command
  signInEmail({
    email: updatedUser.email,
    username: updatedUser.username,
    token: updatedUser.token,
  });

  res
    .status(200)
    .json({ msg: "User created, check your email to confirm account" });
};

const confirmUser = async (req, res) => {
  //Extract token from the header
  const { token } = req.params;

  //Search on db for this token
  const searchedUser = await prisma.user.findFirst({ where: { token } });

  console.log(searchedUser)

  if (searchedUser) {
    //If the user exists, account is confirmed and token is removed
    const updatedUser = await prisma.user.update({
      where: { id: searchedUser.id },
      data: { confirmed: true},
    });

    return res.status(200).json({ msg: "User confirmation success" });
  } else {
    // If the user does not exist, send an error response
    return res.status(404).json({ msg: "Token not found" });
  }
};

const LogInUser = async (req, res) => {
  const data = req.body;
  const { email, password } = data;

  // Check if the user exists
  const searchedUser = await prisma.user.findUnique({
    where: { email },
  });

  // If the user doesn't exist or is not confirmed, a json will show
  if (!searchedUser) {
    const error = new Error("User doesn't exist");
    return res.status(404).json({ msg: error.message });
  } else if (searchedUser.confirmed === false) {
    const error = new Error("Your account needs to be confirmed");
    return res.status(404).json({ msg: error.message });
  }

  //Check the password of the user
  const passwordMatch = await bcrypt.compare(password, searchedUser.password);

  if (passwordMatch) {
    //Create the JWT, that is going to be used on the auth check inside the application
    const token = generarJWT(searchedUser.id);

    const updatedUser = await prisma.user.update({ 
      where: { id: searchedUser.id },
      data: { token: token },
    });

    const { username,github_user } = updatedUser;

    res.status(200).json({ msg: "Login success", email, username, token, github_user });
  } else {
    const error = new Error("Incorrect Password");
    return res.status(404).json({ msg: error.message });
  }
};

const forgetRequest = async (req, res) => {
  const { email } = req.body;

  // Check if the user exists
  const searchedUser = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  // If the user doesn't exist a json will show
  if (!searchedUser) {
    const error = new Error("User doesn't exist");
    return res.status(404).json({ msg: error.message });
  }

  //if user exists an email will be sent, token is reset

  const newToken = generarId();

  const updatedUser = await prisma.user.update({
    where: { id: searchedUser.id },
    data: { token: newToken },
  });

  // Insert send email command
  newPasswordEmail({
    email: updatedUser.email,
    username: updatedUser.username,
    token: updatedUser.token,
  });

  res.json({
    msg: "An email to your account has been sent to reset your password",
  });
};

const checkToken = async (req, res) => {
  const { token } = req.params;

  // Check if the token exists
  const checkedToken = await prisma.user.findFirstOrThrow({ where: { token } });

  if (!checkToken) {
    const error = new Error("Unvalid Token");
    return res.status(404).json({ msg: error.message });
  }

  res.status(200).json({ msg: "Valid Token" });
};

const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Check if the token exists
  const searchedUser = await prisma.user.findFirstOrThrow({ where: { token } });

  if (!searchedUser) {
    const error = new Error("Unvalid Token");
    return res.status(404).json({ msg: error.message });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newToken = "";
  const updatedUser = await prisma.user.update({
    where: { id: searchedUser.id },
    data: { password: hashedPassword, token: newToken },
  });

  res.status(200).json({ msg: "Password successfully changed" });
};

const userProfile = (req, res) => {
  //On req the user will be stored
  console.log('estoy en user')
  const { user } = req;
  console.log(user)
  res.status(200).json({ msg: user });
};

export {
  RegisterUser,
  confirmUser,
  LogInUser,
  forgetRequest,
  checkToken,
  newPassword,
  userProfile,
};
