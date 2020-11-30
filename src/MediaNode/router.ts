/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import {
	IMediaNode,
	IMediaNodeGateway,
  IServiceResponse,
} from "apposition-interfaces";
import DatabaseConnection from "./dbConfig";
import MediaNodeGateway from "./gateway/NodeGateway";
const bodyJsonParser = require("body-parser").json();

/**
 * Router Definition
 */

export const mediaRouter = express.Router();
const MediaNodeService : IMediaNodeGateway = new MediaNodeGateway(DatabaseConnection)

/**
 * Controller Definitions
 */

// Get Node
mediaRouter.get("/:nodeId", async (req: Request, res: Response) => {
  try {
    const response: IServiceResponse<IMediaNode> = await MediaNodeService.getNode(req.params.nodeId);
    res.status(200).send(response);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// // Create Node
mediaRouter.post("", bodyJsonParser, async (req: Request, res: Response) => {
  try {
    let node: IMediaNode = req.body.data
    let response = await MediaNodeService.createNode(node)
    res.status(200).send(response);
  } catch (e) {
    res.status(400).send(e.message);
  }
});


// Delete Node
mediaRouter.delete("/:nodeId", async (req: Request, res: Response) => {
  try {
    const response: IServiceResponse<{}> = await MediaNodeService.deleteNode(req.params.nodeId);
    res.status(200).send(response);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// Delete Nodes
mediaRouter.delete("/list/:nodeIdList", async (req: Request, res: Response) => {
  try {
    const response: IServiceResponse<{}> = await MediaNodeService.deleteNodes(
      req.params.nodeIdList.split(",")
    );
    res.status(200).send(response);
  } catch (e) {
    res.status(400).send(e.message);
  }
});