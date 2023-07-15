import prisma from "../Middlewares/prisma-client.js";
import bcrypt from "bcryptjs";
import generarId from "../Helpers/generarId.js";
import generarJWT from "../Helpers/generarJWT.js";

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

  res.status(200).json(updatedUser);
};

const confirmUser = async (req, res) => {
  //Extract token from the header
  const { token } = req.params;

  //Search on db for this token
  const searchedUser = await prisma.user.findFirstOrThrow({ where: { token } });

  if (searchedUser) {
    //If the user exists, account is confirmed and token is removed
    const updatedUser = await prisma.user.update({
      where: { id: searchedUser.id },
      data: { confirmed: true, token: "" },
    });
    res.status(200).json({ msg: "User confirmation sucess" });
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
      data: {token: token },
    });

    res.status(200).json({ msg: "Login success" });
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
  console.log(newToken)
  const updatedUser = await prisma.user.update({
    where: { id: searchedUser.id },
    data: { token: newToken },
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

  const updatedUser = await prisma.user.update({
    where: { id: searchedUser.id },
    data: { password: password },
  });

  res.status(200).json({ msg: "Password successfully changed" });
};

export {
  RegisterUser,
  confirmUser,
  LogInUser,
  forgetRequest,
  checkToken,
  newPassword,
};
