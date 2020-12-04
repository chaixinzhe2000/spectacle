import IServiceResponse, { failureServiceResponse } from "./IServiceResponse";
import IFilePath, { isFilePath, newFilePath, isStringArray } from "./IFilePath";


export type NodeType = 'node' | 'immutable-text' | 'immutable-grid' | 'media'
export const ALL_NODE_TYPES: NodeType[] = ['node', 'immutable-text', 'immutable-grid', 'media']
const typeSet = new Set(ALL_NODE_TYPES)

export const ROOT_ID = '/'
export const ROOT_LABEL = "Root"

export default interface INode {
	nodeId: string
	label: string
	nodeType: NodeType
	filePath: IFilePath
	children: INode[]
}

function isString(x: any): x is string {
	return typeof x === "string";
}

/**
 * Determines if a object is a valid Node.
 * 
 * @param x: any type
 */
export function isNode(x: any): x is INode {
	const propsDefined = (x as INode).nodeId !== undefined
		&& (x as INode).label !== undefined
		&& (x as INode).filePath !== undefined
		&& (x as INode).children !== undefined
		&& (x as INode).nodeType !== undefined

	if (propsDefined) {
		return typeof (x as INode).nodeId === 'string' && typeof (x as INode).label === 'string' && isNodeType((x as INode).nodeType)
			&& isFilePath((x as INode).filePath) && isNodeArray((x as INode).children)
	}

	return false
}

export function isNodeArray(x: any): x is INode[] {
	if (x instanceof Array) {
		let somethingIsNotNode = false;
		x.forEach(function (item) {
			if (!isNode(item)) {
				somethingIsNotNode = true;
			}
		})

		if (!somethingIsNotNode) {
			return true
		}
	}

	return false
}

/**
 * Helper function for dealing with INodes during testing.
 * 
 * @param nodeId
 * @param label 
 * @param filePath 
 */
export function createNode(nodeId: string, label: string, filePath: IFilePath): INode {
	return {
		nodeId: nodeId,
		label: label,
		filePath: filePath,
		children: [],
		nodeType: 'node'
	}
}

export function isNodeType(input: any): input is NodeType {
	return typeSet.has(input)
}

/**
 * Tries to create an INode from any type. 
 * Returns failure service response with error message if not valid INode.
 * 
 * @param node: any type
 */
export function tryCreateNode(node: any): IServiceResponse<INode> {
	let resp: IServiceResponse<INode> = failureServiceResponse('')

	let nodeId: string;
	let label: string;
	let filePath: IFilePath;
	let children: INode[]
	let nodeType: NodeType;

	if (isString(node.nodeId)) {
		nodeId = node.nodeId
	} else {
		resp.message = "Node nodeId must be a string"
		return resp
	}

	if (isString(node.label)) {
		label = node.label
	} else {
		resp.message = "Node label must be a string"
		return resp
	}

	if (isFilePath(node.filePath)) {
		filePath = node.filePath
	} else if (isStringArray(node.filePath)) {
		filePath = newFilePath(node.filePath)
	} else {
		resp.message = "Node filePath must be a string array"
		return resp
	}

	if (isNodeArray(node.children)) {
		children = node.children
	} else {
		children = []
	}

	if (isNodeType(node.nodeType)) {
		nodeType = node.nodeType
	} else {
		nodeType = 'node'
	}

	// verify nodeId matches filepath nodeId
	if (filePath.nodeId !== nodeId) {
		resp.message = 'DocId and end of filePath must be equal.'
		return resp
	}

	const parsedDoc: INode = {
		nodeId: nodeId,
		label: label,
		filePath: filePath,
		children: children,
		nodeType: nodeType
	}

	resp.success = true
	resp.payload = parsedDoc

	return resp
}