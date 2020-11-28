/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import {
  IServiceResponse,
  ILink,
  ILinkGateway,
} from "hypertext-interfaces";
import LinkGateway from "./gateway/LinkGateway";
import DatabaseConnection from "./dbConfig";
const bodyJsonParser = require("body-parser").json();

/**
 * Router Definition
 */

export const linkRouter = express.Router();

const LinkService: ILinkGateway = new LinkGateway(DatabaseConnection);

/**
 * Controller Definitions
 */

// Get Link
linkRouter.get("/:linkId", async (req: Request, res: Response) => {
  try {
    const response: IServiceResponse<ILink> = await LinkService.getLink(
      req.params.linkId
    );
    res.status(200).send(response);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// // Create Link
linkRouter.post("", bodyJsonParser, async (req: Request, res: Response) => {
  try {
    let link: ILink = req.body.data;
    let response = await LinkService.createLink(link);
    res.status(200).send(response);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// Delete Link
linkRouter.delete("/:linkId", async (req: Request, res: Response) => {
  try {
    const response: IServiceResponse<{}> = await LinkService.deleteLink(
      req.params.linkId
    );
    res.status(200).send(response);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

/**
 * Delete Links: Comma separated list of ids
 */
linkRouter.delete("/list/:linkIdList", async (req: Request, res: Response) => {
  try {
    const response: IServiceResponse<{}> = await LinkService.deleteLinks(
      req.params.linkIdList.split(",")
    );
    res.status(200).send(response);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// Delete Node Links
linkRouter.delete("/node/:nodeId", async (req: Request, res: Response) => {
  try {
    const response: IServiceResponse<{}> = await LinkService.deleteNodeLinks(
      req.params.nodeId
    );
    res.status(200).send(response);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// Delete Anchor Links
linkRouter.delete("/anchor/:anchorId", async (req: Request, res: Response) => {
  try {
    const response: IServiceResponse<{}> = await LinkService.deleteAnchorLinks(
      req.params.anchorId
    );
    res.status(200).send(response);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

/**
 * Get Links: Comma separated list of ids
 */
linkRouter.get("/list/:linkIdList", async (req: Request, res: Response) => {
  try {
    const response: IServiceResponse<{
      [linkId: string]: ILink;
    }> = await LinkService.getLinks(req.params.linkIdList.split(","));

    res.status(200).send(response);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

/**
 * Get Anchor Links
 */
linkRouter.get("/anchor/:anchorId", async (req: Request, res: Response) => {
  try {
    const response: IServiceResponse<{
      [linkId: string]: ILink;
    }> = await LinkService.getAnchorLinks(req.params.anchorId);

    res.status(200).send(response);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

/**
 * Get Node Links
 */
linkRouter.get("/node/:nodeId", async (req: Request, res: Response) => {
  try {
    const response: IServiceResponse<{
      [linkId: string]: ILink;
    }> = await LinkService.getNodeLinks(req.params.nodeId);

    res.status(200).send(response);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
