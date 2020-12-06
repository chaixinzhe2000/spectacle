/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import NodeGateway from './gateway/NodeGateway';
import MongoDatabaseConnection from './database/mongo/MongoNodeDatabaseConnection'
import { INode, IServiceResponse, tryCreateNode, newFilePath, isStringArray, INodeGateway, IFilePath, isFilePath } from 'spectacle-interfaces'
const bodyJsonParser = require('body-parser').json()


/**
 * Router Definition
 */

export const nodeRouter = express.Router();

const NodeService : INodeGateway = new NodeGateway(MongoDatabaseConnection)

/**
 * Controller Definitions
 */


// Get Node
nodeRouter.get("/:nodeId", async (req: Request, res: Response) => {
  try {
    const response: IServiceResponse<INode> = await NodeService.getNode(req.params.nodeId);
    res.status(200).send(response);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// Create Node
nodeRouter.post("", bodyJsonParser, async (req: Request, res: Response) => {
  try {
    let node: INode = req.body.data
    const tryCreateResp = tryCreateNode(node)
    if (tryCreateResp.success) {
      let response = await NodeService.createNode(node)
      res.status(200).send(response);
    } else {
      res.status(404).send(tryCreateResp.message);
    }
  } catch (e) {
    res.status(404).send(e.message);
  }
});


// Update Node
nodeRouter.put("", bodyJsonParser, async (req: Request, res: Response) => {
  try {
    let node: INode = req.body.data
    let response = await NodeService.updateNode(node)
    res.status(200).send(response);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// Delete Node
nodeRouter.delete("/:nodeId", async (req: Request, res: Response) => {
  try {
    const response: IServiceResponse<{}> = await NodeService.deleteNode(req.params.nodeId);
    res.status(200).send(response);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// Get FileTree
nodeRouter.post("/path", async (req: Request, res: Response) => {
  try {
    let path: any = req.body.data
    const fp: IFilePath = isFilePath(path) ? path : newFilePath(path)
    let response = await NodeService.getNodeByPath(fp)
    res.status(200).send(response);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// Move Node
nodeRouter.post("/move", async (req: Request, res: Response) => {
  try {
    let oldLoc: any = req.body.data.old
    let newLoc: any = req.body.data.new
    if (isStringArray(oldLoc) && isStringArray(newLoc)) {
      let response = await NodeService.moveNode(
        newFilePath(oldLoc),
        newFilePath(newLoc)
      )
      res.status(200).send(response);
    } else {
      res.status(404).send("Error: body.data should have parametes (old, new) which are both string arrays.");
    }
  } catch (e) {
    res.status(404).send(e.message);
  }
});
