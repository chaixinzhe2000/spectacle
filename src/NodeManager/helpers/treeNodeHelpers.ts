import { ITreeNode } from '@blueprintjs/core'
import { INode } from 'hypertext-interfaces'

export const selectNode = (nodes: ITreeNode[], id: string): ITreeNode[] => {
  if (nodes.length > 0) {
    const newNodes = nodes.map(node => {
      if (node.id === id)
        node.isSelected = true
      else
        node.isSelected = false

      if (node.childNodes)
        node.childNodes = selectNode(node.childNodes, id)

      return node
    })

    return newNodes
  } else {
    return []
  }
}

export function createTreeNodes(node: INode, currentNodeId: string, removeRoot?: boolean): ITreeNode<INode>[] {
  let childNodes: ITreeNode<INode>[] = []

  if (!node) return []

  if (removeRoot) {
    const nodes = node.children.reduce((acc, curr) => acc = acc.concat(createTreeNodes(curr, currentNodeId)), [])
    return nodes
  }

  node.children.forEach(childDoc => {
    const nodes: ITreeNode<INode>[] = createTreeNodes(childDoc, currentNodeId)
    const node: ITreeNode<INode> = {
      id: childDoc.nodeId,
      label: childDoc.label + ` (${childDoc.nodeId})`,
      isSelected: childDoc.nodeId === currentNodeId,
      nodeData: childDoc
    }

    if ( nodes[0].childNodes.length > 0) {
      node.childNodes = nodes[0].childNodes
      node.isExpanded = true
      node.hasCaret = true
    }
      

    childNodes.push(node)
  })

  return [{
    id: node.nodeId,
    label: node.label + ` (${node.nodeId})`,
    childNodes: childNodes,
    nodeData: node,
    hasCaret: childNodes.length > 0,
    isExpanded: childNodes.length > 0,
    isSelected: node.nodeId === currentNodeId
  }]
}

// helper function for expanding a node
export const setNodeExpand = (treeNodes: ITreeNode<INode>[], node: ITreeNode<INode>, path: number[], expanded: boolean): ITreeNode<INode>[] => {
  const newNodes = [...treeNodes]  
  let nodeTree = newNodes
    path.slice(0, path.length - 1).forEach((n) => {
      nodeTree = nodeTree[n].childNodes
    })

  nodeTree[path[path.length - 1]].isExpanded = expanded
  return newNodes
}