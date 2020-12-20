/**
 * Required External Modules
 */

import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { PDFRouter } from "./PDFNode/router";

export const serviceName = 'pdf'

/**
 *  App Configuration
 */

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(`/${serviceName}`, PDFRouter);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("PDF Node Gateway API Home");
});

/**
 * Server Activation
 */
if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.PORT || 8081, () =>
    console.log("Server Running on :8081")
  );
}

export default app;
