import React, { useState, useEffect } from 'react';
import FileExplorer from './FileSystem';
import { selectNode } from '../helpers/treeNodeHelpers';
import { ITreeNode } from '@blueprintjs/core';
import {INode, IServiceResponse} from 'hypertext-interfaces';
import FileLocation from './FileLocation';

interface SelectFileLocationProps {
  onSelectLocation: (doc: INode) => void
  treeNodes: ITreeNode<INode>[]
  getNode: (nid: string) => IServiceResponse<INode>
}

export default function SelectFileLocation(props: SelectFileLocationProps) {

  const [nodes, setNodes]: [ITreeNode<INode>[], any] = useState([])
  const [node, setNode]: [ITreeNode<INode>, any] = useState(null)

  useEffect(() => setNodes(props.treeNodes), [props.treeNodes])
    return (
      <>
        {/* <div className="bp3-select bp3-fill bp3-large"> */}
        <FileExplorer
          contextMenu={false}
          onNodeClick={(node: ITreeNode<INode>, nodePath: number[]) => {
            setNodes(selectNode(JSON.parse(JSON.stringify(nodes)), node.id.toString()))
            setNode({ ...node })
            props.onSelectLocation(node.nodeData)
          }}
          onNodeDoubleClick={console.log}
          onDelete={console.log}
          onMove={console.log}
          onRename={console.log}
          nodes={nodes}
          setNodeExpand={(expandNode: ITreeNode<INode>
            , numberPath: number[], expanded: boolean) => {
                let newNodes = nodes.map(node => {
                  let newNode = { ...node }
                  if (node.id === expandNode.id) {
                    newNode.isExpanded = expanded
                } 
                return newNode
              })

            setNodes(newNodes)
            
              }}
        />

        <br />
        <FileLocation filePath={node && node.nodeData ? node.nodeData.filePath : null} onClick={console.log} getNode={props.getNode} />
      </>)
}