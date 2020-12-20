import React, { useEffect, useState } from 'react';
import { Button, Divider, NonIdealState, TextArea, Callout, InputGroup } from '@blueprintjs/core';
import { IImmutableTextAnchor, IImmutableTextNode, INode, IPDFNode } from 'spectacle-interfaces';
import { useQuery } from 'react-query';
import NodeGateway from '../Gateways/NodeGateway';


interface PDFViewProps {
	node: IPDFNode
	addNode: (PDFUrl: string) => void
}

function PDFView(props: PDFViewProps): JSX.Element {
	const { node, addNode } = props

	const [PDFUrl, setPDFUrl]: [string, any] = useState('')
	const [description, setDescription]: [string, any] = useState('You are one step away from creating a PDF node...')

	const nodeQueryId = node ? node.nodeId : ""
	const pdfINode: INode = useQuery([nodeQueryId, 'node-title'], NodeGateway.getNode).data?.payload
	const nodeTitle = pdfINode ? pdfINode.label : ""


	if (node) {
		return (<div>
			<Callout className="nodeTitle" icon={"saved"} title={nodeTitle} intent={"warning"}></Callout>
			<Divider />
			<iframe className="frameFormat" src={node.pdfUrl} > </iframe>

		</div>)
	} else {
		return (
			<div>
				<Callout className="nodeTitle" icon={"saved"} title={"New PDF Node"} intent={"warning"}></Callout>
				<Divider />
				<NonIdealState
					icon="document"
					title="Add a PDF URL"
					description={description}
					className="nonIdealState"
					action={
						<div style={{width:"100%"}}>
							<InputGroup fill={true} leftIcon={"link"} onChange={s => setPDFUrl(s.target.value)} value={PDFUrl} 
							rightElement={<Button 
								icon="add"
								onClick={() => {
								if (PDFUrl) {
									addNode(PDFUrl)
									setDescription("You are one step away from creating a PDF node...")
								}
								else
									setDescription("PDF URL cannot be empty.")
							}}> Add </Button>}/>
							<Divider />
							
						</div>
					}
				/>
			</div>
		)
	}
}

export default PDFView