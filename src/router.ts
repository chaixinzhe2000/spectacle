/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import AnchorGateway from './gateway/AnchorGateway';
import { IServiceResponse, IAnchor, IAnchorGateway } from 'spectacle-interfaces'
import DatabaseConnection from "./dbConfig";
const bodyJsonParser = require('body-parser').json()


/**
 * Router Definition
 */

export const anchorRouter = express.Router();

const AnchorService: IAnchorGateway = new AnchorGateway(DatabaseConnection)

/**
 * Controller Definitions
 */
// Get Anchor
anchorRouter.get("/:anchorId", async (req: Request, res: Response) => {
	try {
		const response: IServiceResponse<IAnchor> = await AnchorService.getAnchor(req.params.anchorId);
		res.status(200).send(response);
	} catch (e) {
		res.status(400).send(e.message);
	}
});

// Get Anchor By Node ID
anchorRouter.get("/node/:nodeId", async (req: Request, res: Response) => {
	try {
		const response: IServiceResponse<{ [anchorId: string]: IAnchor }> = await AnchorService.getNodeAnchors(req.params.nodeId);
		res.status(200).send(response);
	} catch (e) {
		res.status(400).send(e.message);
	}
});

// Create Anchor
anchorRouter.post("", bodyJsonParser, async (req: Request, res: Response) => {
	try {
		let anchor: IAnchor = req.body.data
		let response = await AnchorService.createAnchor(anchor)
		res.status(200).send(response);
	} catch (e) {
		res.status(400).send(e.message);
	}
});

// Delete Anchor
anchorRouter.delete("/:anchorId", async (req: Request, res: Response) => {
	try {
		const response: IServiceResponse<{}> = await AnchorService.deleteAnchor(req.params.anchorId);
		res.status(200).send(response);
	} catch (e) {
		res.status(400).send(e.message);
	}
});

// Delete Anchors By Node IDs
anchorRouter.delete("/node/:nodeId", async (req: Request, res: Response) => {
	try {
		const response: IServiceResponse<{}> = await AnchorService.deleteNodeAnchors(req.params.nodeId);
		res.status(200).send(response);
	} catch (e) {
		res.status(400).send(e.message);
	}
});

// Update Anchor Content
anchorRouter.put("/:anchorId/content/", async (req: Request, res: Response) => {
	try {
		const response: IServiceResponse<{}> = await AnchorService.updateAnchorContent(req.params.anchorId, req.body['content']);
		res.status(200).send(response);
	} catch (e) {
		res.status(400).send(e.message);
	}
});