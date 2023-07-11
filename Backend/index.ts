import express from "express";
import dotenv from "dotenv";
import UserRoutes from "./Routes/UserRoutes"

// App delcaration
const app= express();

// enable app to read json
app.use(express.json());

// enable dot env configuration
dotenv.config();

//Routes redirect
app.use("/users", UserRoutes);

const { SERVER_PORT } = process.env;

app.listen(SERVER_PORT, () => {
    console.log(`Talks API listening on port ${SERVER_PORT}`);
  });
