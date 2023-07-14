import express from "express";
import dotenv from "dotenv";
import UserRoutes from "./Routes/UserRoutes.js"
import { errorHandlerMiddleware } from "./Middlewares/controllersMw.js";

// App delcaration
const app= express();

// enable app to read json
app.use(express.json());

// enable dot env configuration
dotenv.config();

//Routes redirect
app.use("/users", UserRoutes);

//use of the errorHandler
app.use(errorHandlerMiddleware)

const { SERVER_PORT } = process.env;

app.listen(SERVER_PORT, () => {
    console.log(`GITFLOWHUB API listening on port ${SERVER_PORT}`);
  });
