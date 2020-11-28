

import { Spinner } from '@blueprintjs/core';
import { INode } from 'hypertext-interfaces';
import React from 'react';
import { queryCache, useMutation, useQuery } from 'react-query';
import ImmutableGridNodeGateway from '../Gateways/ImmutableGrid/ImmutableGridNodeGateway';
import ImmutableGridWithAnchorsContainer from './ImmutableGridWithAnchorsContainer';

interface ImmutableTextContainerProps {
    node: INode
    anchorId: string
    anchorIds: string[]
}

function ImmutableGridContainer(props: ImmutableTextContainerProps): JSX.Element {
  const { node, anchorId, anchorIds } = props

  const { isLoading, data, error } = useQuery([node.nodeId, node.nodeType], ImmutableGridNodeGateway.getNode)

  const [createNode] = useMutation(ImmutableGridNodeGateway.createNode, {
    onSuccess: () => queryCache.invalidateQueries([node.nodeId, node.nodeType]) 
  })

  if (isLoading) return <Spinner />

  if (error) return <div> {'An error has occurred: ' + error} </div>

  return (<div>
        <ImmutableGridWithAnchorsContainer 
            node={data?.payload}
            anchorIds={anchorIds}
            anchorId={anchorId}
            createNode={ign => createNode({
              nodeId: node.nodeId,
              rows: ign.rows,
              columns: ign.columns
            })} />
    </div>
  )
}

export default ImmutableGridContainer;