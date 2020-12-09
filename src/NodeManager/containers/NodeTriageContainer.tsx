import React, { useEffect, useState } from 'react';
import { IAnchor, IImmutableTextAnchor, INode } from 'spectacle-interfaces'
import JsonNodeView from '../components/FolderNodeView';
import ImmutableTextContainer from '../../ImmutableTextNode/ImmutableTextNodeContainer';
import AnchorContainer from '../../Anchors/AnchorContainer';
import { Button, Divider } from '@blueprintjs/core';
import { useNavigate } from 'react-router';
import MediaNodeGateway from '../../Gateways/Media/MediaNodeGateway';
import MediaContainer from '../../MediaNode/MediaNodeContainer';
import RelatedLinksContainer from '../../Links/RelatedLinksContainer'

interface NodeTriageProps {
	node: INode
	anchorId: string
}

function NodeTriage(props: NodeTriageProps): JSX.Element {
	const { node, anchorId } = props

	console.log(node)

	const [selectedAnchor, setSelectedAnchor]: [IAnchor, any] = useState(null)
	const [previewAnchor, setPreviewAnchor]: [IAnchor, any] = useState(null)
	const [anchorIds, setAnchorIds]: [string[], any] = useState([])
    const [mediaPlayed, setMediaPlayed]: [number, any] = useState(-1)
    const [mediaDuration, setMediaDuration]: [number, any] = useState(Infinity)
	const [mediaPlaying, setMediaPlaying]: [boolean, any] = useState(false)
	
	const [newMediaAnchorModal, setNewMediaAnchorModal]: [boolean, any] = useState(false)
	const [newImmutableTextAnchorModal, setImmutableTextNewAnchorModal]: [boolean, any] = useState(false)
	const [newImmutableTextAnchor, setNewImmutableTextAnchor]: [IImmutableTextAnchor, any] = useState(null)
    const [newLinkModalIsOpen, setNewLinkModalIsOpen]: [boolean, any] = useState(false)

    const [previouslyPaused, setPreviouslyPaused]: [boolean, any] = useState(true)
    const [mediaSkipUsingAnnotation, setMediaSkipUsingAnnotation]: [boolean, any] = useState(false)

	useEffect(() => {
		console.log("node has changed")
		setSelectedAnchor(null)
		setPreviewAnchor(null)
		setAnchorIds([])
	}, [node?.nodeId, anchorId])

	let nodeComponent = null

	if (node) {
		switch (node.nodeType) {
			case 'node':
				return <JsonNodeView node={node} />
			case 'immutable-text':
				nodeComponent = <ImmutableTextContainer
					node={node}
					anchorId={previewAnchor ? previewAnchor.anchorId : selectedAnchor ? selectedAnchor.anchorId : anchorId}
					anchorIds={anchorIds} 
					newImmutableTextAnchorModal={newImmutableTextAnchorModal}
					setImmutableTextNewAnchorModal={setImmutableTextNewAnchorModal}
					newImmutableTextAnchor={newImmutableTextAnchor}
					setNewImmutableTextAnchor={setNewImmutableTextAnchor}
					/>
				break
			case 'media':
				nodeComponent = <MediaContainer
					node={node}
                    mediaPlayed={mediaPlayed}
                    setMediaPlayed={setMediaPlayed}
                    setMediaDuration={setMediaDuration}
                    mediaPlaying={mediaPlaying}
					setMediaPlaying={setMediaPlaying}
					newMediaAnchorModal={newMediaAnchorModal}
                    setNewMediaAnchorModal={setNewMediaAnchorModal}
                    previouslyPaused={previouslyPaused}
                    mediaSkipUsingAnnotation={mediaSkipUsingAnnotation}
                    setMediaSkipUsingAnnotation={setMediaSkipUsingAnnotation}
                    />
				break
			default:
				return <div> Hmmm, don't recognize node type {node.nodeType}... </div>
		}
		return <div>
			<div className="NodeTriageContainer">
				{/* // testing commit and push again
                // TODO: here we need to create a state (mediatimestamp) and give the state to the anchors and pass the setState function to the nodeComponent (media). I guess make it optional so immutable text doesn't need it. */}
				<div>
                    {nodeComponent}
                    <RelatedLinksContainer 
                        currentNodeId={node.nodeId}
                    />
                </div>
                
				<AnchorContainer
					selectedAnchor={selectedAnchor}
					setSelectedAnchor={setSelectedAnchor}
					setPreviewAnchor={setPreviewAnchor}
					setAnchorIds={setAnchorIds}
					node={node}
					clearSelection={() => {
						setSelectedAnchor(null)
						setPreviewAnchor(null)
					}}
                    setMediaPlayed={setMediaPlayed}
                    mediaDuration={mediaDuration}
                    mediaPlaying={mediaPlaying}
					setMediaPlaying={setMediaPlaying}
					setNewMediaAnchorModal={setNewMediaAnchorModal}
					newImmutableTextAnchorModal={newImmutableTextAnchorModal}
					setImmutableTextNewAnchorModal={setImmutableTextNewAnchorModal}
					newImmutableTextAnchor={newImmutableTextAnchor}
                    setNewImmutableTextAnchor={setNewImmutableTextAnchor}
                    newLinkModalIsOpen={newLinkModalIsOpen}
                    setNewLinkModalIsOpen={setNewLinkModalIsOpen}
                    setPreviouslyPaused={setPreviouslyPaused}
    				/>
			</div>
		</div>
	}
	else
		return null
}

export default NodeTriage;
