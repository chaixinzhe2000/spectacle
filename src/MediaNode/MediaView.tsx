import React, { useEffect, useState } from 'react';
import { Button, Divider, NonIdealState, TextArea, Intent } from '@blueprintjs/core';
import { IMediaAnchor, IMediaNode } from 'spectacle-interfaces';
import PlayerWrapperClass from './ReactPlayer'
import { Icon } from 'semantic-ui-react';
import { useQuery } from 'react-query';
import NodeGateway from '../Gateways/NodeGateway';

interface NodeProps {
	node: IMediaNode
	addNode: (mediaUrl: string) => void
	setNewMediaTime: any
	mediaPlayed: number
	setMediaPlayed: any
	setMediaDuration: any
	mediaPlaying: boolean
	setMediaPlaying: any
	mediaSkipUsingAnnotation: boolean
	setMediaSkipUsingAnnotation: any
}

function MediaView(props: NodeProps): JSX.Element {
	const { node, addNode, setNewMediaTime, mediaPlayed, setMediaPlayed, setMediaDuration, mediaPlaying, setMediaPlaying, mediaSkipUsingAnnotation, setMediaSkipUsingAnnotation } = props
	const [mediaUrl, setMediaUrl]: [string, any] = useState('')
	const [description, setDescription]: [string, any] = useState('You are one step away from creating a video node...')

	const nodeTitle: string = useQuery([node.nodeId, 'node-title'], NodeGateway.getNode).data?.payload.label

	if (node) {
		return (
			<div>
				<Icon icon="camera" iconSize={20} />
				<div className="nodeTitle" >  {nodeTitle} </div>
				<PlayerWrapperClass
					url={node.mediaUrl}
					setNewMediaTime={setNewMediaTime}
					mediaPlayed={mediaPlayed}
					setMediaPlayed={setMediaPlayed}
					setMediaDuration={setMediaDuration}
					mediaPlaying={mediaPlaying}
					setMediaPlaying={setMediaPlaying}
					mediaSkipUsingAnnotation={mediaSkipUsingAnnotation}
					setMediaSkipUsingAnnotation={setMediaSkipUsingAnnotation}
				/>

			</div>
		)
	} else {
		return <NonIdealState
			icon="video"
			title="Add a Video/Audio URL"
			description={description}
			action={
				<div>
					<TextArea fill={true} onChange={s => setMediaUrl(s.target.value)} value={mediaUrl} />
					<Divider />
					<Button onClick={() => {
						if (mediaUrl) {
							addNode(mediaUrl)
							// setMediaUrl("")
							setDescription("You are one step away from creating a video node...")
						}
						else
							setDescription("Media URL cannot be empty.")
					}}> Add Media + </Button>
				</div>
			}
		/>
	}
}

export default MediaView