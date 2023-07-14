import prisma from "../Middlewares/prisma-client.js";

const RegisterUser = async (req, res) => {
    const data = req.body;
    const createUser = await prisma.user.create({ data });
    res.status(200).json(createUser);
  };

  export {RegisterUser};

