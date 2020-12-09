import React, { useEffect, useState } from 'react';
import { queryCache, useMutation, useQuery } from 'react-query';
import MediaAnchorGateway from '../Gateways/Media/MediaAnchorGateway';
import { Button, ButtonGroup, Divider, Spinner } from '@blueprintjs/core';
import HypertextSdk from '../HypertextSdk';
import { generateAnchorId } from '../NodeManager/helpers/generateNodeId';
import MediaView from './MediaView';
import AddAnchorModal from './AddAnchorModal';
import { IMediaAnchor, IMediaNode } from 'spectacle-interfaces';
import UpdateAnchorModal from '../Anchors/AddFollowUpModal';
import { Anchor } from 'antd';
import AnchorGateway from '../Gateways/AnchorGateway';
import AddLinkModal from '../Links/AddLinkModal';
import PlayerWrapperClass from './ReactPlayer';

interface MediaWithAnchorsContainerProps {
	node: IMediaNode
	createNode: (mediaUrl: string) => void
	mediaPlayed: number
	setMediaPlayed: any
	setMediaDuration: any
	mediaPlaying: boolean
	setMediaPlaying: any
	newMediaAnchorModal: boolean
    setNewMediaAnchorModal: any
    previouslyPaused: boolean
    mediaSkipUsingAnnotation: boolean
    setMediaSkipUsingAnnotation: any
}

function MediaWithAnchorsContainer(props: MediaWithAnchorsContainerProps): JSX.Element {

    const { node, createNode, mediaPlayed, setMediaPlayed, setMediaDuration,
    	mediaPlaying, setMediaPlaying, newMediaAnchorModal, setNewMediaAnchorModal, previouslyPaused, mediaSkipUsingAnnotation, setMediaSkipUsingAnnotation } = props
	const [newAnchor, setNewAnchor]: [IMediaAnchor, any] = useState(null)
	const [newMediaTime, setNewMediaTime]: [number, any] = useState(0)

	// TODO: call on this one!!!!!!!! hypertextsdk stufff
	const [createAnchor] = useMutation(HypertextSdk.createMediaAnchor, {
		onSuccess: () => queryCache.invalidateQueries([node.nodeId, 'anchors'])
	})

    // const [previouslyPaused, setPreviouslyPaused]: [boolean, any] = useState(true)

	return (<div style={{ margin: '0', width: '100%', padding: '10px', border: '1px solid lightgrey' }}>

		<MediaView
			node={node}
			addNode={createNode}
			setNewMediaTime={setNewMediaTime}
			mediaPlayed={mediaPlayed}
			setMediaPlayed={setMediaPlayed}
			setMediaDuration={setMediaDuration}
			mediaPlaying={mediaPlaying}
            setMediaPlaying={setMediaPlaying}
            mediaSkipUsingAnnotation={mediaSkipUsingAnnotation}
            setMediaSkipUsingAnnotation={setMediaSkipUsingAnnotation}
		/>

		<AddAnchorModal
			isOpen={newMediaAnchorModal}
            onClose={() => {
                setNewMediaAnchorModal(false);
                setMediaPlaying(!previouslyPaused);
            }}
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
                setNewMediaAnchorModal(false)
			}}
            newMediaTime={newMediaTime}
            setMediaPlaying={setMediaPlaying}
            previouslyPaused={previouslyPaused}
		/>
	</div>
	)
}

export default MediaWithAnchorsContainer;