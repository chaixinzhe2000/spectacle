import INodeDatabaseConnection from "../database/NodeDatabaseConnection";
import {
  IServiceResponse,
  failureServiceResponse,
  getServiceResponse,
} from "hypertext-interfaces";


// TODO implement node gateway interface
export default class NodeGateway {
  dbConnection: INodeDatabaseConnection;

  constructor(nodeDbConnection: INodeDatabaseConnection) {
    this.dbConnection = nodeDbConnection;
  }
}
