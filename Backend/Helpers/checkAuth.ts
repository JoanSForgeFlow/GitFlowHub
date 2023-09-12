import jwt from "jsonwebtoken";
import prisma from "../Middlewares/prisma-client.js";

const checkAuth = async (req, res, next) => {
  console.log("Entrando al middleware checkAuth");

  // Imprimir todos los encabezados de la petición entrante
  console.log("Encabezados recibidos:", req.headers);
  console.log(`Accediendo a la ruta: ${req.path}`);


  // Verificar si hay una cabecera de autorización
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    console.log("Cabecera de autorización encontrada", req.headers.authorization);

    let token;
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token extraído:", token);

      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decodificado con éxito:", decoded);

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
      console.log("Usuario encontrado en la base de datos:", searchedUser);

      // Añadir el usuario al objeto req
      req.user = searchedUser;

      // Ir al siguiente middleware
      return next();
    } catch (error) {
      console.log("Error durante la verificación de autorización:", error);
      return res.status(404).json({ msg: "Error durante la verificación de autorización" });
    }
  }

  console.log("No se encontró la cabecera de autorización o no empieza con Bearer");
  return res.status(401).json({ msg: "Token no válido o expirado" });
};

export default checkAuth;
