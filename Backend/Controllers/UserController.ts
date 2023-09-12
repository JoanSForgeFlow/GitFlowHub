import prisma from "../Middlewares/prisma-client.js";
import bcrypt from "bcryptjs";
import generarId from "../Helpers/generarId.js";
import generarJWT from "../Helpers/generarJWT.js";
import { signInEmail, newPasswordEmail } from "../Helpers/emails.js";
import { updateUserPullRequests } from "../Crons/cronJobs.js";
import { getAndUpdateAvatarUrl } from './PRDashboardController.js';

const RegisterUser = async (req, res) => {
  try {
    console.log("RegisterUser function called"); // Log cuando se llama la función
    const data = req.body;

    console.log("Received data:", data); // Log de los datos recibidos

    const { password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);

    data.password = hashedPassword;

    const createUser = await prisma.user.create({ data });

    console.log("User created:", createUser); // Log del usuario creado

    // Generate a token that will be used to confirm account
    const token = generarId();

    const updatedUser = await prisma.user.update({
      where: { id: createUser.id },
      data: { token },
    });

    console.log("User updated with token:", updatedUser); // Log del usuario actualizado con el token

    // Insert send email command
    signInEmail({
      email: updatedUser.email,
      username: updatedUser.username,
      token: updatedUser.token,
    });

    res
      .status(200)
      .json({ msg: "User created, check your email to confirm account" });

  } catch (error) {
    console.error("An error occurred:", error); // Log si se produce un error
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const confirmUser = async (req, res) => {
  const { token } = req.params;

  const searchedUser = await prisma.user.findFirst({ where: { token } });

  if (searchedUser) {
    const updatedUser = await prisma.user.update({
      where: { id: searchedUser.id },
      data: { confirmed: true },
    });

    console.log(updatedUser);

    // Start updating the user's PRs in the background
    updateUserPullRequests().catch((error) => {
      console.error('Error updating PRs in the background:', error);
    });

    // Update the user's avatar URL
    const githubUser = searchedUser.github_user;
    const fakeReq = { params: { githubUser } };
    const fakeRes = {
      status: (statusCode) => {
        console.log(`Avatar update returned status: ${statusCode}`);
        return {
          send: (message) => console.log(message),
          json: (json) => console.log(json),
        };
      },
    };

    await getAndUpdateAvatarUrl(fakeReq, fakeRes);

    // Send success response
    return res.status(200).json({ msg: "User confirmation successful" });
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

    const { username, github_user } = updatedUser;

    res
      .status(200)
      .json({ msg: "Login success", email, username, token, github_user });
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
  const { user } = req;

  const {
    email,
    github_user,
    id,
    image,
    avatar_url,
    language,
    location,
    timezone,
    username,
    company_id
  } = user;

  res
    .status(200)
    .json({
      email,
      github_user,
      id,
      image,
      avatar_url,
      language,
      location,
      timezone,
      username,
      company_id
    });
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
