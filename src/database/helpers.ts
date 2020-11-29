import { failureServiceResponse, INode, IFilePath, IServiceResponse, isFilePath, newFilePath, successfulServiceResponse, NodeType } from "hypertext-interfaces"

export interface IMongoNode {
    _id: string // replaces nodeId
    label: string
    path: string // serialized version of filePath
    nodeType: NodeType
    filePath: string[]
    createdAt?: Date
    lastUpdatedAt?: Date
}
  
export function getMongoNode(node: INode, type: 'create' | 'update'): IServiceResponse<IMongoNode> {
    try {
        let mongonode: IMongoNode = {
            _id: node.nodeId.toLocaleLowerCase(),
            label: node.label,
            nodeType: node.nodeType,
            path: serializeFilePath(node.filePath),
            filePath: node.filePath.filePath,
        }

        switch (type) {
            case 'create':
            mongonode.createdAt = new Date()
            mongonode.lastUpdatedAt = new Date()
            break
            case 'update':
            mongonode.lastUpdatedAt = new Date()
            break
        }
        return successfulServiceResponse(mongonode)
    } catch {
        return failureServiceResponse("Failed to parse INode into IMongoNode, verify that the INode passed in is valid.")
    }
}

export function getNode(mongoNode: IMongoNode): INode {
    return {
        nodeId: mongoNode._id,
        label: mongoNode.label,
        nodeType: mongoNode.nodeType,
        filePath: newFilePath(mongoNode.filePath),
        children: []
    }
}

export function serializeFilePath(filePath: IFilePath | string[] | string): string {
    let fpString = ''
    if (isFilePath(filePath)) 
        fpString = filePath.filePath.join(',') + ','
    else if (typeof filePath === 'string')
        fpString = filePath.split("/").join(",") + ','
    else
        fpString = filePath.join(',')


    if (!fpString.endsWith(','))
        fpString += ','
    if (!fpString.startsWith(','))
        fpString = ',' + fpString

    return fpString 
}