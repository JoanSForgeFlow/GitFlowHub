import jwt from "jsonwebtoken";
import prisma from "../Middlewares/prisma-client.js";

const checkAuth = async (req, res, next) => {
  //Auth will be done by using JsonWebTokenError method

  // Bearer es una convencion que se utiliza para enviar el token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //req.headers.authorization returns a token Bearer
      // we want to obtain what it is next to the Bearer, then, we will uncrypt using jwt
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);


      const searchedUser = await prisma.user.findUniqueOrThrow({
        where: { id: parseInt(decoded.id) },
        select: {
          id: true,
          username: true,
          email: true,
          location:true,
          language:true,
          timeZone:true,
          image:true,
          github_user: true,
        },
      });

      // Create user variable, we will introduce all data except the password
      req.user = searchedUser;
      //Once we have created the user we will go through the next middleware
      return next();
    } catch (error) {
      return res.status(404).json({ msg: "There is an error" });
    }
  }

  // if the user doesn't send a token, an error will be displayed
  if (!token) {
    const error = new Error("Unvalid or expired token");
    return res.status(401).json({ msg: error.message });
  }
  next();
};

export default checkAuth;
