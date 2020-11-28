import { ITestLinkDatabaseConnection, } from "../ILinkDatabaseConnection";
import {
  IServiceResponse,
  successfulServiceResponse,
  failureServiceResponse,
  getServiceResponse,
  ILink,
} from "hypertext-interfaces";
import { IMongoLink, getMongoLink, tryGetLink } from "../helpers";

class MockMongoDatabaseConnection implements ITestLinkDatabaseConnection {
  _links: { [linkId: string]: IMongoLink };

  constructor() {
    this._links = {};
    this.clearLinkCollection = this.clearLinkCollection.bind(this);
    this.initLinks = this.initLinks.bind(this);
    this.insertLink = this.insertLink.bind(this);
    this.findLink = this.findLink.bind(this);
    this.findLinks = this.findLinks.bind(this);
    this.deleteLink = this.deleteLink.bind(this);
    this.deleteLinks = this.deleteLinks.bind(this);
  }

  async clearLinkCollection(): Promise<IServiceResponse<{}>> {
    this._links = {};
    return successfulServiceResponse({});
  }

  async initLinks(links: ILink[]): Promise<IServiceResponse<{}>> {
    links.forEach((link) => {
      const mongoLinkResp = getMongoLink(link);
      if (!mongoLinkResp.success) {
        return failureServiceResponse(mongoLinkResp.message);
      }
      this._links[link.linkId] = mongoLinkResp.payload;
    });
    return successfulServiceResponse({});
  }

  async insertLink(link: ILink): Promise<IServiceResponse<ILink>> {
    if (link === null)
      return failureServiceResponse('AnchorId is null')
    const mongoLinkResp = getMongoLink(link);
    if (!mongoLinkResp.success) {
      return failureServiceResponse(mongoLinkResp.message);
    }
    if (this._links[link.linkId])
      return failureServiceResponse("Link already exists");
    this._links[link.linkId] = mongoLinkResp.payload;
    return successfulServiceResponse(link);
  }

  async findLink(linkId: string): Promise<IServiceResponse<ILink>> {
    if (linkId === null)
      return failureServiceResponse('AnchorId is null')
    const link = this._links[linkId];

    if (link) {
      const tryCreateLinkResp = tryGetLink(link);
      return getServiceResponse(tryCreateLinkResp, "Failed to find link\n");
    }

    return failureServiceResponse("Failed to find links");
  }

  async findLinks(
    linkIds: string[]
  ): Promise<IServiceResponse<{ [linkId: string]: ILink }>> {
    if (linkIds === null)
      return failureServiceResponse('AnchorId is null')
    const links: { [linkId: string]: ILink } = {};

    async function findAndAdd(linkId: string, findLink: Function) {
      const findResponse = await findLink(linkId);
      if (findResponse.success)
        links[findResponse.payload.linkId] = findResponse.payload;
    }

    await Promise.all(
      linkIds.map((linkId) => {
        return findAndAdd(linkId, this.findLink);
      })
    );

    if (Object.keys(links).length === 0) {
      return failureServiceResponse("Failed to find any links.");
    }

    return successfulServiceResponse(links);
  }

  async findLinksByNode(
    nodeId: string
  ): Promise<IServiceResponse<{ [linkId: string]: ILink }>> {
    if (nodeId === null)
      return failureServiceResponse('NodeId is null')
    const links: { [linkId: string]: ILink } = {};

    Object.values(this._links).forEach((link) => {
      if (link.destNodeId === nodeId || link.srcNodeId === nodeId) {
        const tryLink = tryGetLink(link);
        if (tryLink.success) {
          links[tryLink.payload.linkId] = tryLink.payload;
        }
      }
    });

    if (Object.keys(links).length === 0) {
      return failureServiceResponse("Failed to find any links.");
    }

    return successfulServiceResponse(links);
  }

  async findLinksByAnchor(
    anchorId: string
  ): Promise<IServiceResponse<{ [linkId: string]: ILink }>> {
    if (anchorId === null)
      return failureServiceResponse('AnchorId is null')
    const links: { [linkId: string]: ILink } = {};

    Object.values(this._links).forEach((link) => {
      if (link.destAnchorId === anchorId || link.srcAnchorId === anchorId) {
        const tryLink = tryGetLink(link);
        if (tryLink.success) {
          links[tryLink.payload.linkId] = tryLink.payload;
        }
      }
    });

    if (Object.keys(links).length === 0) {
      return failureServiceResponse("Failed to find any links.");
    }

    return successfulServiceResponse(links);
  }

  async deleteLink(linkId: string): Promise<IServiceResponse<{}>> {
    if (linkId === null)
      return failureServiceResponse('LinkId is null')
    delete this._links[linkId];
    return successfulServiceResponse({});
  }

  async deleteLinks(linkIds: string[]): Promise<IServiceResponse<{}>> {
    if (linkIds === null)
      return failureServiceResponse('LinkIds is null')
    linkIds.forEach((nid) => delete this._links[nid]);
    return successfulServiceResponse({});
  }

  async deleteNodeLinks(nodeId: string): Promise<IServiceResponse<{}>> {
    if (nodeId === null)
      return failureServiceResponse('NodeId is null')
    let count = 0;
    const linksToDelete: ILink[] = [];

    Object.values(this._links).forEach((link) => {
      if (link.srcNodeId === nodeId || link.destNodeId === nodeId) {
        const linkResp = tryGetLink(link);
        if (linkResp.success) {
          linksToDelete.push(linkResp.payload);
        }
      }
    });

    linksToDelete.forEach((link) => {
      if (this._links[link.linkId]) {
        delete this._links[link.linkId];
        count++;
      }
    });
    return successfulServiceResponse({});
  }

  async deleteAnchorLinks(anchorId: string): Promise<IServiceResponse<{}>> {
    if (anchorId === null)
      return failureServiceResponse('AnchorId is null')

    let count = 0;
    const linksToDelete: ILink[] = [];

    Object.values(this._links).forEach((link) => {
      if (link.srcAnchorId === anchorId || link.destAnchorId === anchorId) {
        const linkResp = tryGetLink(link);
        if (linkResp.success) {
          linksToDelete.push(linkResp.payload);
        }
      }
    });

    linksToDelete.forEach((link) => {
      if (this._links[link.linkId]) {
        delete this._links[link.linkId];
        count++;
      }
    });
    return successfulServiceResponse({});
  }
}

export default MockMongoDatabaseConnection;
