import {
  ITestLinkDatabaseConnection,
} from "../ILinkDatabaseConnection";
import MongoDbConnection from "./mongodbConnection";
import {
  IServiceResponse,
  successfulServiceResponse,
  failureServiceResponse,
  getServiceResponse,
  ILink,
} from "spectacle-interfaces";
import { getMongoLink, IMongoLink, tryGetLink } from "../helpers";
import { getLinkCollection } from "./getCollection";

const MongoDatabaseConnection: ITestLinkDatabaseConnection = {
  async clearLinkCollection(): Promise<IServiceResponse<{}>> {
    const collection = await getLinkCollection(MongoDbConnection);
    const response = await collection.deleteMany({});
    if (response.result.ok) {
      return successfulServiceResponse({});
    }

    return failureServiceResponse("Failed to clear link collection.");
  },

  async initLinks(links: ILink[]): Promise<IServiceResponse<{}>> {
    const mongoLinks: IMongoLink[] = [];

    links.forEach((link) => {
      const mongoLinkResp = getMongoLink(link);
      if (!mongoLinkResp.success) {
        return failureServiceResponse(mongoLinkResp.message);
      }
      mongoLinks.push(mongoLinkResp.payload);
    });

    try {
      const collection = await getLinkCollection(MongoDbConnection);
      const insertResponse = await collection.insertMany(mongoLinks);
      if (insertResponse.result.ok) {
        return successfulServiceResponse({});
      }
    } catch (e) {
      return failureServiceResponse(`Failed to create new links.`);
    }
  },

  async insertLink(link: ILink): Promise<IServiceResponse<ILink>> {
    
    const mongoLinkResp = getMongoLink(link);
    if (!mongoLinkResp.success) {
      return failureServiceResponse(mongoLinkResp.message);
    }
    const mongoLink = mongoLinkResp.payload;

    try {
      const collection = await getLinkCollection(MongoDbConnection);
      const insertResponse = await collection.insertOne(mongoLink);
      if (insertResponse.result.ok) {
        return successfulServiceResponse(link);
      }
    } catch (e) {
      return failureServiceResponse(
        `Failed to create new link, it's possible that a link with linkId: ${link.linkId} already exists.`
      );
    }
  },

  async findLink(linkId: string): Promise<IServiceResponse<ILink>> {
    if (linkId === null)
      return failureServiceResponse('linkId is null')
    const collection = await getLinkCollection(MongoDbConnection);
    const findResponse = await collection.findOne({ _id: linkId });

    if (findResponse && findResponse._id === linkId) {
      const tryCreateLinkResp = tryGetLink(findResponse);
      return getServiceResponse(tryCreateLinkResp, "Failed to find link\n");
    }

    return failureServiceResponse("Failed to find links");
  },

  async findLinks(
    linkIds: string[]
  ): Promise<IServiceResponse<{ [linkId: string]: ILink }>> {
    if (linkIds === null)
      return failureServiceResponse('linkIds is null')
    const collection = await getLinkCollection(MongoDbConnection);
    const myquery = { _id: { $in: linkIds } };
    const findResponse = await collection.find(myquery);

    const links: { [linkId: string]: ILink } = {};
    await findResponse.forEach((mongolink) => {
      const linkResponse = tryGetLink(mongolink);
      if (linkResponse.success)
        links[linkResponse.payload.linkId] = linkResponse.payload;
    });

    if (Object.keys(links).length === 0) {
      return failureServiceResponse("Failed to find any links at that path.");
    }

    return successfulServiceResponse(links);
  },

  async findLinksByNode(
    nodeId: string
  ): Promise<IServiceResponse<{ [linkId: string]: ILink }>> {
    const collection = await getLinkCollection(MongoDbConnection);
    const myquery = {
      $or: [
        { srcNodeId: { $in: [nodeId] } },
        { destNodeId: { $in: [nodeId] } },
      ],
    };
    const findResponse = await collection.find(myquery);
    const links: { [linkId: string]: ILink } = {};
    await findResponse.forEach((mongolink) => {
      const linkResponse = tryGetLink(mongolink);
      if (linkResponse.success)
        links[linkResponse.payload.linkId] = linkResponse.payload;
    });

    if (Object.keys(links).length === 0) {
      return failureServiceResponse("Failed to find any links for that node.");
    }

    return successfulServiceResponse(links);
  },
  async findLinksByAnchor(
    anchorId: string
  ): Promise<IServiceResponse<{ [linkId: string]: ILink }>> {
    
    const collection = await getLinkCollection(MongoDbConnection);
    const myquery = {
      $or: [
        { srcAnchorId: { $in: [anchorId] } },
        { destAnchorId: { $in: [anchorId] } },
      ],
    };
    const findResponse = await collection.find(myquery);

    const links: { [linkId: string]: ILink } = {};
    await findResponse.forEach((mongolink) => {
      const linkResponse = tryGetLink(mongolink);
      if (linkResponse.success)
        links[linkResponse.payload.linkId] = linkResponse.payload;
    });

    if (Object.keys(links).length === 0) {
      return failureServiceResponse(
        "Failed to find any links for that anchor."
      );
    }

    return successfulServiceResponse(links);
  },

  async deleteLink(linkId: string): Promise<IServiceResponse<{}>> {
    if (linkId === null)
      return failureServiceResponse('linkIds is null')
    const collection = await getLinkCollection(MongoDbConnection);
    const deleteResponse = await collection.deleteOne({ _id: linkId });
    if (deleteResponse.result.ok) {
      return successfulServiceResponse({});
    }

    return failureServiceResponse("Failed to delete");
  },

  async deleteLinks(linkIds: string[]): Promise<IServiceResponse<{}>> {
    if (linkIds === null)
      return failureServiceResponse('linkIds is null')
    const collection = await getLinkCollection(MongoDbConnection);

    const myquery = { _id: { $in: linkIds } };
    const deleteResponse = await collection.deleteMany(myquery);

    if (deleteResponse.result.ok) {
      return successfulServiceResponse({});
    }

    return failureServiceResponse("Failed to delete links");
  },

  async deleteNodeLinks(nodeId: string): Promise<IServiceResponse<{}>> {
    if (nodeId === null)
      return failureServiceResponse('nodeId is null')
    const collection = await getLinkCollection(MongoDbConnection);

    const myquery = {
      $or: [
        { srcNodeId: { $in: [nodeId] } },
        { destNodeId: { $in: [nodeId] } },
      ],
    };
    const deleteResponse = await collection.deleteMany(myquery);

    if (deleteResponse.result.ok) {
      return successfulServiceResponse({});
    }

    return failureServiceResponse("Failed to delete links");
  },

  async deleteAnchorLinks(anchorId: string): Promise<IServiceResponse<{}>> {
    if (anchorId === null)
      return failureServiceResponse('AnchorId is null')
    const collection = await getLinkCollection(MongoDbConnection);

    const myquery = {
      $or: [
        { srcAnchorId: { $in: [anchorId] } },
        { destAnchorId: { $in: [anchorId] } },
      ],
    };
    const deleteResponse = await collection.deleteMany(myquery);

    if (deleteResponse.result.ok) {
      return successfulServiceResponse({});
    }

    return failureServiceResponse("Failed to delete links");
  },
};

export default MongoDatabaseConnection;
