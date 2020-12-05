import React, { useEffect, useState } from 'react';
import {  useNavigate, useParams } from 'react-router';
import { failureServiceResponse, IFilePath, INode, IServiceResponse, newFilePath, successfulServiceResponse } from 'hypertext-interfaces'
import { useQuery, useMutation, queryCache } from 'react-query'
import NodeGateway from '../../Gateways/NodeGateway';
import NodeManagerExplorer from './NodeManager';
import HypertextSdk from '../../HypertextSdk';
import { ROOT_ID } from 'hypertext-interfaces/dist/INode';

async function fetchNode(nodeId: string) {
  if (nodeId === ROOT_ID) {
    return await NodeGateway.getNodeByPath(newFilePath([]))
  } else if (nodeId) {
    return await NodeGateway.getNode(nodeId)
  }
}

async function moveNodeWrapper(data: {
  moveFrom: IFilePath,
  moveTo: IFilePath
}) {
  return await NodeGateway.moveNode(data.moveFrom, data.moveTo)
}

function updateCache(node: INode) {
  node.children.forEach(child => { 
    updateCache(child)
    queryCache.setQueryData(child.nodeId, successfulServiceResponse(child))
  })
}

export function getNode(nodeId: string): IServiceResponse<INode> {
  const sr: IServiceResponse<INode> = queryCache.getQueryData(nodeId)
  if (sr) {
    return sr
  }
  return failureServiceResponse("Node isn't in cache")
}

interface NodeManagerContainerProps {
  setLoading: (loading: boolean) => void 
}

export default function NodeManagerContainer(props: NodeManagerContainerProps) {
  
  // keep state of the selected node
  const [selectedNode, setSelectedNode]: [INode, any] = useState(null)

  // get url parameters
  const { nodeId, anchorId } = useParams()

  // if no node id exists, set current node id to root id
  const currentNodeId = nodeId || ROOT_ID

  // fetch node data based on currentNodeId
  const { isLoading, data, refetch } = useQuery(currentNodeId, fetchNode, {
    onSuccess: (data: IServiceResponse<INode>) => {
      if (selectedNode === null) {
        setSelectedNode(data.payload)
      }
      updateCache(data.payload)
    },
    
  })

  // set is loading when value changes
  useEffect(() => {
    props.setLoading(isLoading);
  }, [isLoading])

  // reset selected node and refetch node when currentNodeId changes 
  useEffect(() => {
    setSelectedNode(null)
    refetch()
  }, [currentNodeId])

  // Automatically fetch and cache when component first mounts
  useEffect(() => {
    const prefetchNodes = async () => {
      const prefetchResponse = await queryCache.prefetchQuery(ROOT_ID, () => NodeGateway.getNodeByPath(newFilePath([])))
      if (prefetchResponse.success) {
        updateCache(prefetchResponse.payload)
      }
    }

    prefetchNodes()
  }, [])


  const navigate = useNavigate()

  // when node is deleted, invalidate current node
  const [deleteNode] = useMutation(HypertextSdk.deleteNode, {
    onSuccess: (data, node) => {
      if (node.nodeId === selectedNode.nodeId) {
        setSelectedNode(null)
      }
      queryCache.invalidateQueries(currentNodeId)
    }
  })

  // when new node is updated, invalidate current node
  const [updateNode] = useMutation(NodeGateway.updateNode, {
    onSuccess: () => queryCache.invalidateQueries(currentNodeId) 
  })

  // when node is moved, invalidate current node
  const [moveNode] = useMutation(moveNodeWrapper, {
    onSuccess: () => queryCache.invalidateQueries(currentNodeId) 
  })

  // when new node is created, invalidate current node
  const [createNode] = useMutation(NodeGateway.createNode, {
    onSuccess: () => queryCache.invalidateQueries(currentNodeId) 
  })

  return (
    <>
	<div className="comment-title">Your Library</div>

      <NodeManagerExplorer 
        selectedNode={selectedNode}
        loading={isLoading}
        rootNode={data?.payload}
        onDeleteNode={deleteNode}
        onCreateNode={createNode}
        onNodeClick={node => setSelectedNode(node)}
        onUpdateNode={updateNode}
        getNode={getNode}
        anchorId={anchorId}
        onNodeDoubleClick={id => navigate(`/nodes/${id}`)}
        onMoveNode={(from: IFilePath, to: IFilePath) => moveNode({
          moveFrom: from,
          moveTo: to
        })}
      /> 
    </>
  );
} 