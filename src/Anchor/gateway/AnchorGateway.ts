import IAnchorDatabaseConnection from "../database/IAnchorDatabaseConnection";
import {
  IServiceResponse,
  failureServiceResponse,
  getServiceResponse
} from "hypertext-interfaces";

// TODO: This class should implement an anchor gateway interface
export default class ImmutableGridAnchorGateway {
  dbConnection: IAnchorDatabaseConnection;

  constructor(nodeDbConnection: IAnchorDatabaseConnection) {
    this.dbConnection = nodeDbConnection;
  }
}
