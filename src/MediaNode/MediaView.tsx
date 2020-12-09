import React, { useEffect, useState } from 'react';
import { Button, Divider, NonIdealState, TextArea, Intent } from '@blueprintjs/core';
import { IMediaAnchor, IMediaNode } from 'spectacle-interfaces';
import PlayerWrapperClass from './ReactPlayer'

interface NodeProps {
	node: IMediaNode
	addNode: (mediaUrl: string) => void
    setNewMediaTime: any
    mediaPlayed: number
    setMediaPlayed: any
    setMediaDuration: any
    mediaPlaying: boolean
	setMediaPlaying: any
}

function MediaView(props: NodeProps): JSX.Element {
	// const { node, anchor, anchors, setAnchor, addNode, previewAnchor, selectedAnchorId, setNewMediaTime, mediaPlayed, setMediaPlayed, setMediaDuration, mediaPlaying, setMediaPlaying } = props
    const { node, addNode, setNewMediaTime, mediaPlayed, setMediaPlayed, setMediaDuration, mediaPlaying, setMediaPlaying } = props
    const [mediaUrl, setMediaUrl]: [string, any] = useState('')
	const [description, setDescription]: [string, any] = useState('You are one step away from creating a video node...')

	// useEffect(() => {
	// 	async function setAnchors() {
	// 		await setHighlightedAnchors([])
	// 		if (previewAnchor)
	// 			setHighlightedAnchors([previewAnchor])
	// 		else if (anchor)
	// 			setHighlightedAnchors([anchor])
	// 		else {
	// 			const selectedAnchor = anchors.find(anc => anc.anchorId === selectedAnchorId)
	// 			if (selectedAnchor)
	// 				setHighlightedAnchors([selectedAnchor])
	// 			else
	// 				setHighlightedAnchors(anchors)
	// 		}
	// 	}
	// 	setAnchors()
	// }, [previewAnchor, anchor, anchors])

	if (node) {
		console.log(node)
		return (
			<div>
            <PlayerWrapperClass
				url={node.mediaUrl}
                setNewMediaTime={setNewMediaTime}
                mediaPlayed={mediaPlayed}
                setMediaPlayed={setMediaPlayed}
                setMediaDuration={setMediaDuration}
                mediaPlaying={mediaPlaying}
                setMediaPlaying={setMediaPlaying}
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