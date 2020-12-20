import { INode,  createNode, newFilePath } from "spectacle-interfaces"

export default function initTestingTree(tree: { id: string, filePath: string[] }[]): INode[] {
  tree = tree.sort((a, b) => a.filePath.length - b.filePath.length)
  return tree.map((val: { id: string, filePath: string[] }) =>  createNode(val.id, val.id, newFilePath(val.filePath)))
}