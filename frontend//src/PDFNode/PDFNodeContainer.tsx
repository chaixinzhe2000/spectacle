import React, { useEffect, useState } from 'react';
import { queryCache, useMutation, useQuery } from 'react-query';
import { IImmutableTextAnchor, INode, IPDFNode } from 'spectacle-interfaces';
import ImmutableTextNodeGateway from '../Gateways/ImmutableText/ImmutableTextNodeGateway';
import { Spinner } from '@blueprintjs/core';
import ImmutableTextWithAnchorsContainer from './PDFWithAnchorsContainer';
import PDFWithAnchorsContainer from './PDFWithAnchorsContainer'
import PDFNodeGateway from '../Gateways/PDFGateway';

interface PDFContainerProps {
    node: INode
    newPDFAnchorModal: boolean
    setNewPDFAnchorModal: any
}

function PDFContainer(props: PDFContainerProps): JSX.Element {
	const { node, newPDFAnchorModal, setNewPDFAnchorModal } = props

    const { isLoading, data, error } = useQuery([node.nodeId, node.nodeType], PDFNodeGateway.getNode)


    const [createNode] = useMutation(PDFNodeGateway.createNode, {
		onSuccess: () => queryCache.invalidateQueries([node.nodeId, node.nodeType])
    })
    
    if (isLoading) return <Spinner />

	if (error) return <div> {'An error has occurred: ' + error} </div>

	return (<div>
		<PDFWithAnchorsContainer
            node={data?.payload}
            createNode={PDFUrl => createNode({
				nodeId: node.nodeId,
				pdfUrl: PDFUrl
            })}
            newPDFAnchorModal={newPDFAnchorModal}
            setNewPDFAnchorModal={setNewPDFAnchorModal}
		/>
	</div>
	)
}

export default PDFContainer;
