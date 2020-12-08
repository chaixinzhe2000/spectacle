/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import {
	IPDFNode,
	IPDFNodeGateway,
	IServiceResponse,
} from "spectacle-interfaces";
import DatabaseConnection from "./dbConfig";
import PDFNodeGateway from "./gateway/NodeGateway";
const bodyJsonParser = require("body-parser").json();

/**
 * Router Definition
 */

export const PDFRouter = express.Router();
const PDFNodeService: IPDFNodeGateway = new PDFNodeGateway(DatabaseConnection)

/**
 * Controller Definitions
 */

// Get Node
PDFRouter.get("/:nodeId", async (req: Request, res: Response) => {
	try {
		const response: IServiceResponse<IPDFNode> = await PDFNodeService.getNode(req.params.nodeId);
		res.status(200).send(response);
	} catch (e) {
		res.status(400).send(e.message);
	}
});

// Create Node
PDFRouter.post("", bodyJsonParser, async (req: Request, res: Response) => {
	try {
		let node: IPDFNode = req.body.data
		let response = await PDFNodeService.createNode(node)
		res.status(200).send(response);
	} catch (e) {
		res.status(400).send(e.message);
	}
});

// Delete Node
PDFRouter.delete("/:nodeId", async (req: Request, res: Response) => {
	try {
		const response: IServiceResponse<{}> = await PDFNodeService.deleteNode(req.params.nodeId);
		res.status(200).send(response);
	} catch (e) {
		res.status(400).send(e.message);
	}
});

// Delete Nodes
PDFRouter.delete("/list/:nodeIdList", async (req: Request, res: Response) => {
	try {
		const response: IServiceResponse<{}> = await PDFNodeService.deleteNodes(
			req.params.nodeIdList.split(",")
		);
		res.status(200).send(response);
	} catch (e) {
		res.status(400).send(e.message);
	}
});

// Update PDF URL
PDFRouter.put("/:anchorId/", bodyJsonParser, async (req: Request, res: Response) => {
	try {
		let pdfUrl: string = req.body.pdfUrl
		let response = await PDFNodeService.updateNode(req.params.anchorId, pdfUrl)
		res.status(200).send(response);
	} catch (e) {
		res.status(400).send(e.message);
	}
});