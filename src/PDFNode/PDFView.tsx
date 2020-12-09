import React, { useEffect, useState } from 'react';
import { Button, Divider, NonIdealState, TextArea } from '@blueprintjs/core';
import { IImmutableTextAnchor, IImmutableTextNode, IPDFNode } from 'spectacle-interfaces';
import { Icon } from 'semantic-ui-react';
import { Document, Page } from 'react-pdf';
import { useQuery } from 'react-query';
import NodeGateway from '../Gateways/NodeGateway';

interface PDFViewProps {
    node: IPDFNode
    addNode: (PDFUrl: string) => void
}

function PDFView(props: PDFViewProps): JSX.Element {
	const { node, addNode } = props

    const [mediaUrl, setMediaUrl]: [string, any] = useState('')
	const [description, setDescription]: [string, any] = useState('You are one step away from creating a video node...')

	const nodeTitle: string = useQuery([node.nodeId, 'node-title'], NodeGateway.getNode).data?.payload.label

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
      }
    
	if (node) {
		return (<div>
            <Document
              file={node.pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page pageNumber={pageNumber} />
            </Document>
            <p>Page {pageNumber} of {numPages}</p>
          </div>)
	} else {
		return <NonIdealState
			icon="video"
			title="Add a PDF URL"
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

export default PDFView