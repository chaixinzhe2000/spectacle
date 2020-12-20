import React, { useEffect, useState } from 'react';
import Highlightable from 'highlightable'
import { Button, Callout, Divider, NonIdealState, TextArea } from '@blueprintjs/core';
import { IImmutableTextAnchor, IImmutableTextNode, INode } from 'spectacle-interfaces';
import { Icon } from 'semantic-ui-react';
import { useQuery } from 'react-query';
import NodeGateway from '../Gateways/NodeGateway';


interface NodeProps {
	node: IImmutableTextNode
	anchor: IImmutableTextAnchor
	previewAnchor: IImmutableTextAnchor
	setAnchor: (anchor: IImmutableTextAnchor) => void
	addNode: (text: string) => void
	anchors: IImmutableTextAnchor[]
	selectedAnchorId: string
}

function ImmutableTextView(props: NodeProps): JSX.Element {
	const { node, anchor, anchors, setAnchor, addNode, previewAnchor, selectedAnchorId } = props
	const [text, setText]: [string, any] = useState('')
	const [description, setDescription]: [string, any] = useState('You can still add one...')
	const [highlightedAnchors, setHighlightedAnchors]: [IImmutableTextAnchor[], any] = useState([])

	const nodeQueryId = node ? node.nodeId : ""
	const mediaINode: INode = useQuery([nodeQueryId, 'node-title'], NodeGateway.getNode).data?.payload
	const nodeTitle = mediaINode ? mediaINode.label : ""

	if (node) {
		return (<div>
			<Callout className="nodeTitle" icon={"highlight"} title={nodeTitle} intent={"warning"}></Callout>
			<Divider />
			<Highlightable
				ranges={highlightedAnchors}
				enabled={true}
				onTextHighlighted={r => {
					setAnchor({
						anchorId: null,
						start: r.start,
						end: r.end
					})
				}}
				highlightStyle={{
					backgroundColor: '#ffcc80'
				}}
				text={node.text} />
		</div>)
	} else {
		return(
		<div>
			<Callout className="nodeTitle" icon={"presentation"} title={"New Immutable Text Node"} intent={"warning"}></Callout>
			<Divider />
			<NonIdealState
				icon="new-text-box"
				title="No Immutable Text Node found."
				className="nonIdealState"
				description={description}
				action={
					<div style={{ width: "100%" }}>
						<TextArea style={{ minHeight: "150px" }} fill={true} onChange={s => setText(s.target.value)} large={true} value={text} />
						<Divider />
						<Button onClick={() => {
							if (text) {
								addNode(text)
								setText("")
								setDescription("You can still add one...")
							}
							else
								setDescription("Cannot add an empty Immutable Text string.")
						}}> Add Immutable Text + </Button>
					</div>
				}
			/>
		</div>
	)}
}

export default ImmutableTextView