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
	newImmutableTextAnchorModal: boolean
	setImmutableTextNewAnchorModal: any
	newImmutableTextAnchor: IImmutableTextAnchor
	setNewImmutableTextAnchor: any
}

function ImmutableTextWithAnchorsContainer(props: ImmutableTextWithAnchorsContainerProps): JSX.Element {

	const { node, anchorId, anchorIds, createNode, newImmutableTextAnchorModal, setImmutableTextNewAnchorModal,
		newImmutableTextAnchor, setNewImmutableTextAnchor } = props
	// const [newAnchor, setNewAnchor]: [IImmutableTextAnchor, any] = useState(null)
	// const [newAnchorModal, setNewAnchorModal]: [boolean, any] = useState(false)

	const [createAnchor] = useMutation(HypertextSdk.createImmutableTextAnchor, {
		onSuccess: () => queryCache.invalidateQueries([node.nodeId, 'anchors'])
	})

	const { isLoading, data, error } = useQuery([anchorIds, 'immutable-text'], ImmutableTextAnchorGateway.getAnchors)
	const immutableTextAnchorMap = data && data.success ? data.payload : {}
	const immutableTextAnchors = data && data.success ? Object.values(data.payload) : []

	if (isLoading) return <Spinner />

	return (<div style={{ margin: '0', marginTop: '39px', width: '100%', padding: '10px', border: '1px solid lightgrey' }}>
		{newImmutableTextAnchor && <> <ButtonGroup>
			<Button text="Create Anchor" onClick={() => setImmutableTextNewAnchorModal(true)} />
			<Button text="Clear Selection" onClick={() => setNewImmutableTextAnchor(null)} />
		</ButtonGroup> <Divider /> </>}

		<ImmutableTextView
			previewAnchor={immutableTextAnchorMap[anchorId]}
			node={node}
			anchor={newImmutableTextAnchor}
			selectedAnchorId={anchorId}
			anchors={immutableTextAnchors}
			addNode={createNode}
			setAnchor={anc => {
				setNewImmutableTextAnchor(null)
				setNewImmutableTextAnchor(anc)
			}} />

		<AddAnchorModal
			isOpen={newImmutableTextAnchorModal}
			onClose={() => setImmutableTextNewAnchorModal(false)}
			onAdd={(annotation, author) => {
				const anchorId = generateAnchorId()
				// TODO: hardcoded
				createAnchor({
					anchor: {
						nodeId: node.nodeId,
						anchorId: anchorId,
						contentList: [annotation],
						authorList: [author],
						createdAt: new Date(),
						type: 'immutable-text'
					},
					immutableTextAnchor: {
						anchorId: anchorId,
						start: newImmutableTextAnchor.start,
						end: newImmutableTextAnchor.end
					}
				})
				setNewImmutableTextAnchor(null)
				setImmutableTextNewAnchorModal(false)
			}}
			text={node && newImmutableTextAnchor ? node.text.substring(newImmutableTextAnchor.start, newImmutableTextAnchor.end + 1) : ''}
			anchor={newImmutableTextAnchor}
		/>
	</div>
	)
}

export default ImmutableTextWithAnchorsContainer;