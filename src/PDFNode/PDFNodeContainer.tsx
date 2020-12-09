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
    anchorId: string
    anchorIds: string[]
    newPDFAnchorModal: boolean
    setNewPDFAnchorModal: any
}

function ImmutableTextContainer(props: PDFContainerProps): JSX.Element {
	const { node, anchorId, anchorIds, newPDFAnchorModal, setNewPDFAnchorModal } = props

    const { isLoading, data, error } = useQuery([node.nodeId, node.nodeType], PDFNodeGateway.getNode)


    const [createNode] = useMutation(PDFNodeGateway.createNode, {
		onSuccess: () => queryCache.invalidateQueries([node.nodeId, node.nodeType])
	})

	return (<div>
		<PDFWithAnchorsContainer
            node={data?.payload}
            anchorId={anchorId}
            anchorIds={anchorIds}
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

export default ImmutableTextContainer;
