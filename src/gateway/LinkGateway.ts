import ILinkDatabaseConnection from "../database/ILinkDatabaseConnection";
import {
  IServiceResponse,
  failureServiceResponse,
  ILink,
  ILinkGateway,
} from "hypertext-interfaces";

export default class LinkGateway implements ILinkGateway {
  dbConnection: ILinkDatabaseConnection;

  constructor(linkDbConnection: ILinkDatabaseConnection) {
    this.dbConnection = linkDbConnection;
  }

  /**
   * Creates a Link in the database with the given link id.
   *
   * @param link - link to create
   *
   * Returns a failure service response if:
   *  - the id already exists in the database
   */
  async createLink(link: ILink): Promise<IServiceResponse<ILink>> {
    try {
      if (link.destAnchorId === link.srcAnchorId)
        return failureServiceResponse(
          "Source Anchor Id and Dest Anchor Id cannot be the same"
        );
      return await this.dbConnection.insertLink(link);
    } catch (error) {
      return failureServiceResponse("Invalid ILink: " + error);
    }
  }

  /**
   * Gets a Link (and it's children) from the database by link id.
   *
   * @param linkId - id of link to retrieve
   *
   * Returns a failure service response if:
   *  - the id does not exist in the database
   */
  async getLink(linkId: string): Promise<IServiceResponse<ILink>> {
    return await this.dbConnection.findLink(linkId);
  }
  /**
   * Get the Links in the given array from the database.
   *
   * @param linkIds - id of links to retrieve
   *
   * Returns a successful service response if:
   *  - all of the links exist in the database
   *
   * Returns a failure service response if:
   *  - one or more of the links are invalid
   */
  async getLinks(
    linkIds: string[]
  ): Promise<IServiceResponse<{ [linkId: string]: ILink }>> {
    return await this.dbConnection.findLinks(linkIds);
  }

  /**
   * Deletes a Link in the database.
   *
   * @param linkId - id of link to delete
   *
   * Returns a successful service response if:
   *  - the link no longer exists in the database, even if already it didn't exist before
   *
   * Returns a failure service response if:
   *  - the database fails to delete the link
   */
  async deleteLink(linkId: string): Promise<IServiceResponse<{}>> {
    return await this.dbConnection.deleteLink(linkId);
  }

  /**
   * Deletes the Links in the given array from the database.
   *
   * @param linkIds - id of links to delete
   *
   * Returns a successful service response.
   */
  async deleteLinks(linkIds: string[]): Promise<IServiceResponse<{}>> {
    return await this.dbConnection.deleteLinks(linkIds);
  }
  /**
   * Get the Links for a given anchor from the database.
   *
   * @param anchorId - id of anchor
   *
   * Returns a successful service response if:
   *  - the anchor exists
   *
   * Returns a failure service response if:
   *  - the anchor does not exist
   */
  async getAnchorLinks(
    anchorId: string
  ): Promise<IServiceResponse<{ [linkId: string]: ILink }>> {
    return await this.dbConnection.findLinksByAnchor(anchorId);
  }

  /**
   * Get the Links for a given node from the database.
   *
   * @param nodeId - id of node
   *
   * Returns a successful service response if:
   *  - the node exists
   *
   * Returns a failure service response if:
   *  - the node does not exist
   */
  async getNodeLinks(
    nodeId: string
  ): Promise<IServiceResponse<{ [linkId: string]: ILink }>> {
    return await this.dbConnection.findLinksByNode(nodeId);
  }

  /**
   * Deletes the links of a node from the database.
   *
   * @param nodeId - id of node
   *
   * Returns a successful service response
   */
  async deleteNodeLinks(nodeId: string): Promise<IServiceResponse<{}>> {
    return await this.dbConnection.deleteNodeLinks(nodeId);
  }

  /**
   * Deletes the links of an anchor from the database.
   *
   * @param anchorId - id of anchor
   *
   * Returns a successful service response
   */
  async deleteAnchorLinks(anchorId: string): Promise<IServiceResponse<{}>> {
    return await this.dbConnection.deleteAnchorLinks(anchorId);
  }
}
