import React, { useEffect, useState } from 'react';
import { Button, Divider, NonIdealState, TextArea } from '@blueprintjs/core';
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
            {nodeTitle}
           <iframe src={node.pdfUrl} > </iframe>
          </div>)
	} else {
		return <NonIdealState
			icon="video"
			title="Add a PDF URL"
			description={description}
			action={
				<div>
					<TextArea fill={true} onChange={s => setPDFUrl(s.target.value)} value={PDFUrl} />
					<Divider />
					<Button onClick={() => {
						if (PDFUrl) {
							addNode(PDFUrl)
							// setMediaUrl("")
							setDescription("You are one step away from creating a PDF node...")
						}
						else
							setDescription("PDF URL cannot be empty.")
					}}> Add PDF + </Button>
				</div>
			}
		/>
	}
}

export default PDFView