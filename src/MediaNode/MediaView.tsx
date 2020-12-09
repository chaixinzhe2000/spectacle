import React, { useEffect, useState } from 'react';
import { Button, Divider, NonIdealState, TextArea, Intent, Callout, InputGroup } from '@blueprintjs/core';

import { IMediaAnchor, IMediaNode, INode } from 'spectacle-interfaces';
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

	const nodeQueryId = node ? node.nodeId : ""
	const mediaINode: INode = useQuery([nodeQueryId, 'node-title'], NodeGateway.getNode).data?.payload
	const nodeTitle = mediaINode ? mediaINode.label : ""

	if (node) {
		return (
			<div>
				<Callout className="nodeTitle" icon={"presentation"} title={nodeTitle} intent={"warning"}></Callout>
				<Divider />
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
			className="nonIdealState"
			action={
				<div style={{width:"100%"}}>
					<InputGroup fill={true} leftIcon={"link"} onChange={s => setMediaUrl(s.target.value)} value={mediaUrl} 
					rightElement={<Button onClick={() => {
						if (mediaUrl) {
							addNode(mediaUrl)
							setDescription("You are one step away from creating a video node...")
						}
						else
							setDescription("Media URL cannot be empty.")
					}}> Add Media </Button>}/>
					<Divider />
					
				</div>
			}
		/>
	}
}

export default MediaView