import React, { useEffect, useState } from 'react';
import { queryCache, useMutation, useQuery } from 'react-query';
import ImmutableTextAnchorGateway from '../Gateways/ImmutableText/ImmutableTextAnchorGateway';
import { Button, ButtonGroup, Divider, Spinner } from '@blueprintjs/core';
import HypertextSdk from '../HypertextSdk';
import { generateAnchorId } from '../NodeManager/helpers/generateNodeId';
import AddAnchorModal from './AddAnchorModal';
import PDFView from './PDFView'
import { IAnchor, IPDFNode } from 'spectacle-interfaces';
import AnchorGateway from '../Gateways/AnchorGateway';

interface PDFWithAnchorsContainerProps {
    node: IPDFNode
    createNode: (PDFUrl: string) => void
    newPDFAnchorModal: boolean
    setNewPDFAnchorModal: any
}

function PDFWithAnchorsContainer(props: PDFWithAnchorsContainerProps): JSX.Element {

    const { node, createNode, newPDFAnchorModal, setNewPDFAnchorModal } = props

    const [newAnchor, setNewAnchor]: [IAnchor, any] = useState(null)

    const [createAnchor] = useMutation(HypertextSdk.createPDFAnchor, {
        onSuccess: () => queryCache.invalidateQueries([node.nodeId, 'anchors'])
    })

    return (<div style={{ margin: '0', width: '100%', padding: '10px', border: '1px solid lightgrey' }}>
        <PDFView
            node={node}
            addNode={createNode}
        />

        <AddAnchorModal
            isOpen={newPDFAnchorModal}
            onClose={() => {
                setNewPDFAnchorModal(false);
            }}
            onAdd={(content, author) => {
                const anchorId = generateAnchorId()
                createAnchor({
                    anchor: {
                        nodeId: node.nodeId,
                        anchorId: anchorId,
                        contentList: [content],
                        authorList: [author],
                        type: 'PDF',
                        createdAt: new Date()
                    }
                })
                setNewAnchor(null)
                setNewPDFAnchorModal(false)
            }}
        />
    </div>
    )
}

export default PDFWithAnchorsContainer;