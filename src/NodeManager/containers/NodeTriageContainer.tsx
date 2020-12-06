import React, { useEffect, useState } from 'react';
import { IAnchor, INode } from 'spectacle-interfaces'
import JsonNodeView from '../components/JsonNodeView';
import ImmutableTextContainer from '../../ImmutableTextNode/ImmutableTextNodeContainer';
import ImmutableGridContainer from '../../ImmutableGridNode/ImmutableGridNodeContainer';
import AnchorContainer from '../../Anchors/AnchorContainer';
import { Button, Divider } from '@blueprintjs/core';
import { useNavigate } from 'react-router';

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
			case 'immutable-grid':
				nodeComponent = <ImmutableGridContainer
					node={node}
					anchorId={previewAnchor ? previewAnchor.anchorId : selectedAnchor ? selectedAnchor.anchorId : anchorId}
					anchorIds={anchorIds} />
				break
			case 'immutable-text':
				nodeComponent = <ImmutableTextContainer
					node={node}
					anchorId={previewAnchor ? previewAnchor.anchorId : selectedAnchor ? selectedAnchor.anchorId : anchorId}
					anchorIds={anchorIds} />
				break
			// TODO: added media
			case 'media':
				nodeComponent = <MediaContainer
					node={node}
					anchorId={previewAnchor ? previewAnchor.anchorId : selectedAnchor ? selectedAnchor.anchorId : anchorId}
					anchorIds={anchorIds} />
				break
			default:
				return <div> Hmmm, don't recognize node type {node.nodeType}... </div>
		}

		return <div>

			{nodeComponent}

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
			/>
		</div>
	}
	else
		return null
}

export default NodeTriage;
