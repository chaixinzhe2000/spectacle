/**
 * Required External Modules
 */

import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { linkRouter } from "./router";

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
app.use("/link", linkRouter);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Link Gateway API Home");
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

// import { IServiceResponse } from "node-interfaces";

// export interface ILink {
//   linkId: string;
//   srcAnchorId: string;
//   destAnchorId: string;
//   srcNodeId: string;
//   destNodeId: string;
// }

// export interface ILinkGateway {
//   createLink(link: ILink): Promise<IServiceResponse<ILink>>;
//   getLink(linkId: string): Promise<IServiceResponse<ILink>>;
//   getLinks(
//     linkIds: string[]
//   ): Promise<IServiceResponse<{ [linkId: string]: ILink }>>;
//   getAnchorLinks(
//     anchorId: string
//   ): Promise<IServiceResponse<{ [linkId: string]: ILink }>>;
//   getNodeLinks(
//     nodeId: string
//   ): Promise<IServiceResponse<{ [linkId: string]: ILink }>>;
//   deleteLink(linkId: string): Promise<IServiceResponse<{}>>;
//   deleteLinks(linkId: string[]): Promise<IServiceResponse<{}>>;
//   deleteNodeLinks(nodeId: string): Promise<IServiceResponse<{}>>;
//   deleteAnchorLinks(anchorId: string): Promise<IServiceResponse<{}>>;
// }
