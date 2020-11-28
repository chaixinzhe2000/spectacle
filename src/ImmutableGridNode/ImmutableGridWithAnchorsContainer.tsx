

import React, { useEffect, useState } from 'react';
import { queryCache, useMutation, useQuery } from 'react-query';
import { IAnchor, IImmutableGridAnchor, IImmutableGridNode, IImmutableTextAnchor, INode, IServiceResponse, successfulServiceResponse } from 'hypertext-interfaces';
import ImmutableTextNodeGateway from '../Gateways/ImmutableText/ImmutableTextNodeGateway';
import AnchorGateway from '../Gateways/AnchorGateway';
import ImmutableTextAnchorGateway from '../Gateways/ImmutableText/ImmutableTextAnchorGateway';
import AnchorContainer from '../Anchors/AnchorContainer';
import AnchorView from '../Anchors/AnchorView';
import { Button, ButtonGroup, Divider, Spinner } from '@blueprintjs/core';
import HypertextSdk from '../HypertextSdk';
import { generateAnchorId } from '../NodeManager/helpers/generateNodeId';
import LinkContainer from '../Links/LinkContainer';
import { useNavigate } from 'react-router';
import ImmutableGridView from './ImmutableGridView';
import ImmutableGridNodeGateway from '../Gateways/ImmutableGrid/ImmutableGridNodeGateway';
import ImmutableGridAnchorGateway from '../Gateways/ImmutableGrid/ImmutableGridAnchorGateway';
import AddGridAnchorModal from './AddGridAnchorModal';

interface ImmutableGridWithAnchorsContainerProps {
    node: IImmutableGridNode
    anchorId: string
    anchorIds: string[]
    createNode: (node: IImmutableGridNode) => void
}

function ImmutableGridWithAnchorsContainer(props: ImmutableGridWithAnchorsContainerProps): JSX.Element {

  const { node, anchorId, anchorIds, createNode } = props
  const [newAnchor, setNewAnchor]: [IImmutableGridAnchor, any] = useState(null)
  const [newAnchorModal, setNewAnchorModal]: [boolean, any] = useState(false)

  const [createAnchor] = useMutation(HypertextSdk.createImmutableGridAnchor, {
    onSuccess: () => queryCache.invalidateQueries([node.nodeId, 'anchors']) 
  })

  const { isLoading, data, error } = useQuery([ anchorIds, 'immutable-grid' ], ImmutableGridAnchorGateway.getAnchors)
  const immutableGridAnchorMap = data && data.success ? data.payload : {}
  const immutableGridAnchors = data && data.success ? Object.values(data.payload) : []

  if (isLoading) return <Spinner />

  return (<div style={{margin: 'auto', marginTop: '10px', width: '50%', padding: '10px', border: '1px dashed black'}}>
    {newAnchor && <> <ButtonGroup>
        <Button text="Create Anchor" onClick={() => setNewAnchorModal(true) }/> 
        <Button text="Clear Selection" onClick={() => setNewAnchor(null) }/> 
    </ButtonGroup> <Divider /> </>}
    <ImmutableGridView
        setNewAnchor={anc => {
            setNewAnchor(anc)
        }}
        newAnchor={newAnchor}
        node={node}
        onAdd={(columns, rows) => createNode({
            nodeId: '',
            columns: columns,
            rows: rows
        })}
        anchors={immutableGridAnchors}
        previewAnchor={immutableGridAnchorMap[anchorId]}
    />

    <Divider />

    <AddGridAnchorModal 
        isOpen={newAnchorModal}
        onClose={() => setNewAnchorModal(false)}
        onAdd={label => {
            const anchorId = generateAnchorId()
            createAnchor({
                anchor: {
                    nodeId: node.nodeId,
                    anchorId: anchorId,
                    label: label,
                    type: 'immutable-grid'
                },
                immutableGridAnchor: {
                    anchorId: anchorId,
                    bottomRightCell: newAnchor.bottomRightCell,
                    topLeftCell: newAnchor.topLeftCell
                }
            })
            setNewAnchor(null)
            setNewAnchorModal(false)
        }}
        node={node}
        anchor={newAnchor} />
    </div>
  )
}

export default ImmutableGridWithAnchorsContainer;