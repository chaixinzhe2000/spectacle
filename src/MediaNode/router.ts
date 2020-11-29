/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import {
  IServiceResponse,
} from "apposition-interfaces";
import DatabaseConnection from "./dbConfig";
import NodeGateway from "./gateway/NodeGateway";
const bodyJsonParser = require("body-parser").json();

/**
 * Router Definition
 */

export const nodeRouter = express.Router();


// TODO
const NodeService = new NodeGateway(DatabaseConnection);

/**
 * Controller Definitions
 */