import jwt from "jsonwebtoken";
import prisma from "../Middlewares/prisma-client.js";

const checkAuth = async (req, res, next) => {
  // Verificar si hay una cabecera de autorización
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    let token;
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar el usuario en la base de datos
      const searchedUser = await prisma.user.findUniqueOrThrow({
        where: { id: parseInt(decoded.id) },
        select: {
          id: true,
          username: true,
          email: true,
          location: true,
          language: true,
          timeZone: true,
          image: true,
          github_user: true,
          avatar_url: true,
        },
      });

      // Añadir el usuario al objeto req
      req.user = searchedUser;

      // Ir al siguiente middleware
      return next();
    } catch (error) {
      return res.status(404).json({ msg: "Error durante la verificación de autorización" });
    }
  }

  return res.status(401).json({ msg: "Token no válido o expirado" });
};

export default checkAuth;
