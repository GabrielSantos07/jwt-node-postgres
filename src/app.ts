import { AppDataSource } from "./database/data-source";
import { User } from "./entity/User";
import routes from "./routes";
import { AppError } from "./errors/AppError";
import * as express from "express";
import { NextFunction, Request, Response } from "express";



const app = express();

app.use(express.json());
app.use(routes);

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
})

app.use(
  (err: Error, request: Request, response: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: "Error",
      message: `Internal server error ${err.message}`,
    });
  }
);

export { app };
