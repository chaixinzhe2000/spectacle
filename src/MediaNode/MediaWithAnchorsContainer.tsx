import React, { useEffect, useState } from 'react';
import { queryCache, useMutation, useQuery } from 'react-query';
import MediaAnchorGateway from '../Gateways/Media/MediaAnchorGateway';
import { Button, ButtonGroup, Divider, Spinner } from '@blueprintjs/core';
import HypertextSdk from '../HypertextSdk';
import { generateAnchorId } from '../NodeManager/helpers/generateNodeId';
import MediaView from './MediaView';
import AddAnchorModal from './AddAnchorModal';
import { IMediaAnchor, IMediaNode } from 'spectacle-interfaces';

interface MediaWithAnchorsContainerProps {
	node: IMediaNode
	anchorId: string
	anchorIds: string[]
	createNode: (mediaUrl: string) => void
}

function MediaWithAnchorsContainer(props: MediaWithAnchorsContainerProps): JSX.Element {

	const { node, anchorId, anchorIds, createNode } = props
	const [newAnchor, setNewAnchor]: [IMediaAnchor, any] = useState(null)
	const [newAnchorModal, setNewAnchorModal]: [boolean, any] = useState(false)

	// TODO: call on this one!!!!!!!! hypertextsdk stufff
	const [createAnchor] = useMutation(HypertextSdk.createMediaAnchor, {
		onSuccess: () => queryCache.invalidateQueries([node.nodeId, 'anchors'])
	})

	const { isLoading, data, error } = useQuery([anchorIds, 'media'], MediaAnchorGateway.getAnchors)
	const MediaAnchorMap = data && data.success ? data.payload : {}
	const MediaAnchors = data && data.success ? Object.values(data.payload) : []

	if (isLoading) return <Spinner />

	return (<div style={{ margin: 'auto', marginTop: '10px', width: '50%', padding: '10px', border: '1px dashed black' }}>
		
			<div>
				<ButtonGroup>
					<Button text="Create Anchor" onClick={() => setNewAnchorModal(true)} />
				</ButtonGroup>
				<Divider />
			</div>

		<MediaView
			previewAnchor={MediaAnchorMap[anchorId]}
			node={node}
			anchor={newAnchor}
			selectedAnchorId={anchorId}
			anchors={MediaAnchors}
			addNode={createNode}
			setAnchor={anc => {
				setNewAnchor(null)
				setNewAnchor(anc)
			}} />

		<AddAnchorModal
			isOpen={newAnchorModal}
			onClose={() => setNewAnchorModal(false)}
			onAdd={(content, author, timeStamp) => {
				const anchorId = generateAnchorId()
				createAnchor({
					anchor: {
						nodeId: node.nodeId,
						anchorId: anchorId,
						contentList: [content],
						authorList: [author],
						createdAt: new Date(),
						type: 'media'
					},
					mediaAnchor: {
						anchorId: anchorId,
						mediaTimeStamp: timeStamp
					}
				})
				setNewAnchor(null)
				setNewAnchorModal(false)
			}}
			anchor={newAnchor}
		/>
	</div>
	)
}

export default MediaWithAnchorsContainer;