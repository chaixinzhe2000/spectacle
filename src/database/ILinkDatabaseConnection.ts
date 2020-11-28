import { IServiceResponse, ILink } from "hypertext-interfaces";

export default interface ILinkDatabaseConnection {
  insertLink(link: ILink): Promise<IServiceResponse<ILink>>;

  findLink(linkId: string): Promise<IServiceResponse<ILink>>;

  findLinks(
    linkIds: string[]
  ): Promise<IServiceResponse<{ [linkId: string]: ILink }>>;

  deleteLink(linkId: string): Promise<IServiceResponse<{}>>;

  deleteLinks(linkIds: string[]): Promise<IServiceResponse<{}>>;

  deleteNodeLinks(nodeId: string): Promise<IServiceResponse<{}>>;

  deleteAnchorLinks(nodeId: string): Promise<IServiceResponse<{}>>;

  findLinksByNode(
    nodeId: string
  ): Promise<IServiceResponse<{ [linkId: string]: ILink }>>;

  findLinksByAnchor(
    anchorId: string
  ): Promise<IServiceResponse<{ [linkId: string]: ILink }>>;
}

export interface ITestLinkDatabaseConnection extends ILinkDatabaseConnection {
  clearLinkCollection(): Promise<IServiceResponse<{}>>;
  initLinks(links: ILink[]): Promise<IServiceResponse<{}>>;
}
