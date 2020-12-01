/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import DatabaseConnection from "./dbConfig";
import {
	IMediaAnchor,
	IMediaAnchorGateway,
  IServiceResponse
} from "spectacle-interfaces";
import MediaAnchorGateway from "./gateway/MediaAnchorGateway";
const bodyJsonParser = require("body-parser").json();

/**
 * Router Definition
 */

export const anchorRouter = express.Router();

const MediaAnchorService : IMediaAnchorGateway = new MediaAnchorGateway(DatabaseConnection)

/**
 * Controller Definitions
 */

// Get Anchor
anchorRouter.get("/:anchorId", async (req: Request, res: Response) => {
  try {
    const response: IServiceResponse<IMediaAnchor> = await MediaAnchorService.getAnchor(req.params.anchorId);
    res.status(200).send(response);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// Get Anchors
anchorRouter.get("/list/:anchorIdList", async (req: Request, res: Response) => {
  try {
    const response: IServiceResponse<{
      [anchorId: string]: IMediaAnchor;
    }> = await MediaAnchorService.getAnchors(
      req.params.anchorIdList.split(",")
    );
    res.status(200).send(response);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// // Create Anchor
anchorRouter.post("", bodyJsonParser, async (req: Request, res: Response) => {
  try {
    let anchor: IMediaAnchor = req.body.data
    let response = await MediaAnchorService.createAnchor(anchor)
    res.status(200).send(response);
  } catch (e) {
    res.status(400).send(e.message);
  }
});


// Delete Anchor
anchorRouter.delete("/:anchorId", async (req: Request, res: Response) => {
  try {
    const response: IServiceResponse<{}> = await MediaAnchorService.deleteAnchor(req.params.anchorId);
    res.status(200).send(response);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// Delete Anchors
anchorRouter.delete("/list/:anchorIds", async (req: Request, res: Response) => {
  try {
    const response: IServiceResponse<{}> = await MediaAnchorService.deleteAnchors(req.params.anchorIds.split(','));
    res.status(200).send(response);
  } catch (e) {
    res.status(400).send(e.message);
  }
});