/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import DatabaseConnection from "./dbConfig";
import {
  IServiceResponse
} from "apposition-interfaces";
import AnchorGateway from "./gateway/AnchorGateway";
const bodyJsonParser = require("body-parser").json();

/**
 * Router Definition
 */

export const anchorRouter = express.Router();


// TODO
const anchorService = new AnchorGateway(DatabaseConnection);

/**
 * Controller Definitions
 */