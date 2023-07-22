import express from "express";
import dotenv from "dotenv";
import UserRoutes from "./Routes/UserRoutes.js"
import { errorHandlerMiddleware } from "./Middlewares/controllersMw.js";
import cors from 'cors'

// App delcaration
const app= express();

// enable app to read json
app.use(express.json());

// enable dot env configuration
dotenv.config();

//Enable CORS
const whitlelist=[process.env.FRONTEND_URL]

const corsOptions={
  origin: function(origin,callback){
    console.log(origin);
    if (whitlelist.includes(origin)){
      callback(null,true)

    }else{
      callback(new Error('CORS error'))
    }
  }
}

app.use(cors())
//Routes redirect
app.use("/", UserRoutes);

//use of the errorHandler
app.use(errorHandlerMiddleware)

const { SERVER_PORT } = process.env;

app.listen(SERVER_PORT, () => {
    console.log(`GITFLOWHUB API listening on port ${SERVER_PORT}`);
  });
