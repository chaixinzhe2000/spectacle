import React, { useEffect, useState } from 'react';
import { queryCache, useMutation, useQuery } from 'react-query';
import ImmutableTextAnchorGateway from '../Gateways/ImmutableText/ImmutableTextAnchorGateway';
import { Button, ButtonGroup, Divider, Spinner } from '@blueprintjs/core';
import HypertextSdk from '../HypertextSdk';
import { generateAnchorId } from '../NodeManager/helpers/generateNodeId';
import ImmutableTextView from './ImmutableTextView';
import AddAnchorModal from './AddAnchorModal';
import { IImmutableTextAnchor, IImmutableTextNode } from 'spectacle-interfaces';

interface ImmutableTextWithAnchorsContainerProps {
    node: IImmutableTextNode
    anchorId: string
    anchorIds: string[]
    createNode: (text: string) => void
}

function ImmutableTextWithAnchorsContainer(props: ImmutableTextWithAnchorsContainerProps): JSX.Element {

  const { node, anchorId, anchorIds, createNode } = props
  const [newAnchor, setNewAnchor]: [IImmutableTextAnchor, any] = useState(null)
  const [newAnchorModal, setNewAnchorModal]: [boolean, any] = useState(false)

  const [createAnchor] = useMutation(HypertextSdk.createImmutableTextAnchor, {
    onSuccess: () => queryCache.invalidateQueries([node.nodeId, 'anchors']) 
  })

  const { isLoading, data, error } = useQuery([ anchorIds, 'immutable-text' ], ImmutableTextAnchorGateway.getAnchors)
  const immutableTextAnchorMap = data && data.success ? data.payload : {}
  const immutableTextAnchors = data && data.success ? Object.values(data.payload) : []

  if (isLoading) return <Spinner />

  return (<div style={{margin: 'auto', marginTop: '10px', width: '50%', padding: '10px', border: '1px dashed black'}}>
    {newAnchor && <> <ButtonGroup>
        <Button text="Create Anchor" onClick={() => setNewAnchorModal(true) }/> 
        <Button text="Clear Selection" onClick={() => setNewAnchor(null) }/> 
    </ButtonGroup> <Divider /> </>}

    <ImmutableTextView
        previewAnchor={immutableTextAnchorMap[anchorId]}
        node={node} 
        anchor={newAnchor}
        selectedAnchorId={anchorId}
        anchors={immutableTextAnchors}
        addNode={createNode}
        setAnchor={anc => {
            setNewAnchor(null)
            setNewAnchor(anc)
    }}/>

    <AddAnchorModal 
        isOpen={newAnchorModal}
        onClose={() => setNewAnchorModal(false)}
        onAdd={label => {
			const anchorId = generateAnchorId()
			// TODO: hardcoded
            createAnchor({
                anchor: {
                    nodeId: node.nodeId,
                    anchorId: anchorId,
					contentList: ["change this in immutabletextwithanchorscontainer"],
					authorList: ['chaixhcixcshjdsfsd'],
					createdAt: new Date(),
                    type: 'immutable-text'
                },
                immutableTextAnchor: {
                    anchorId: anchorId,
                    start: newAnchor.start,
                    end: newAnchor.end
                }
            })
            setNewAnchor(null)
            setNewAnchorModal(false)
        }}
        text={node && newAnchor ? node.text.substring(newAnchor.start, newAnchor.end + 1) : ''}
        anchor={newAnchor}
    />
    </div>
  )
}

export default ImmutableTextWithAnchorsContainer;