
/**
 * Required External Modules
 */

import bodyParser from 'body-parser';
import cors from "cors";
import express, { NextFunction, Request, Response } from 'express';
import helmet from "helmet";
import { nodeRouter } from "./router";

/**
 * App Variables
 */

/**
 *  App Configuration
 */

const app = express();
 
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use("/node", nodeRouter);


app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send("Node Gateway API Home")
})

 
/**
 * Server Activation
 */

app.listen(process.env.PORT || 8081, () => console.log("Server Running on :8081"))
