

import React, { useEffect, useState } from 'react';
import { queryCache, useMutation, useQuery } from 'react-query';
import { INode } from 'spectacle-interfaces';
import ImmutableTextNodeGateway from '../Gateways/ImmutableText/ImmutableTextNodeGateway';
import { Spinner } from '@blueprintjs/core';
import ImmutableTextWithAnchorsContainer from './ImmutableTextWithAnchorsContainer';

interface ImmutableTextContainerProps {
    node: INode
    anchorId: string
    anchorIds: string[]
}

function ImmutableTextContainer(props: ImmutableTextContainerProps): JSX.Element {
  const { node, anchorId, anchorIds } = props
  const { isLoading, data, error } = useQuery([node.nodeId, node.nodeType], ImmutableTextNodeGateway.getNode)

  const [createNode] = useMutation(ImmutableTextNodeGateway.createNode, {
    onSuccess: () => queryCache.invalidateQueries([node.nodeId, node.nodeType]) 
  })

  if (isLoading) return <Spinner />

  if (error) return <div> {'An error has occurred: ' + error} </div>
  
  return (<div>
        <ImmutableTextWithAnchorsContainer 
            node={data?.payload}
            anchorIds={anchorIds}
            anchorId={anchorId}
            createNode={text => createNode({
                nodeId: node.nodeId,
                text: text
            })}
        />
    </div>
  )
}

export default ImmutableTextContainer;
