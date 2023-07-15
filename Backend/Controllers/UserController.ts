import prisma from "../Middlewares/prisma-client.js";
import bcrypt from "bcryptjs";

const RegisterUser = async (req, res) => {
  const data = req.body;

  const { password } = data;
  const hashedPassword = await bcrypt.hash(password, 10);

  data.password = hashedPassword;

  const createUser = await prisma.user.create({ data });
  res.status(200).json(createUser);
};

const authenticateUser = async (req, res) => {};

const confirmUser = async (req, res) => {
  //Extract token from the header
  const { token } = req.params;

  //Search on db for this token
  const searchedUser = await prisma.user.findFirstOrThrow({ where: { token } });

  if (searchedUser) {
    searchedUser.confirmed = true;
    searchedUser.token = "";
  }
};

const LogInUser = async (req, res) => {
  const data = req.body;
  const { email, password } = data;

  // Check if the user exists
  const user = await prisma.user.findUnique({ where: { email } });

  // If the user doesn't exist, a json will show
  if (!user) {
    const error = new Error("User doesn't exist");
    return res.status(404).json({ msg: error.message });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (passwordMatch) {
    res.status(200).json({ msg: "Login success" });
  } else {
    const error = new Error("Incorrect Password");
    return res.status(404).json({ msg: error.message });
  }
};

export { RegisterUser, LogInUser };
