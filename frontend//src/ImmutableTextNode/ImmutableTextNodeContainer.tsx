

import React, { useEffect, useState } from 'react';
import { queryCache, useMutation, useQuery } from 'react-query';
import { IImmutableTextAnchor, INode } from 'spectacle-interfaces';
import ImmutableTextNodeGateway from '../Gateways/ImmutableText/ImmutableTextNodeGateway';
import { Spinner } from '@blueprintjs/core';
import ImmutableTextWithAnchorsContainer from './ImmutableTextWithAnchorsContainer';

interface ImmutableTextContainerProps {
	node: INode
	anchorId: string
	anchorIds: string[]
	newImmutableTextAnchorModal: boolean
	setImmutableTextNewAnchorModal: any
	newImmutableTextAnchor: IImmutableTextAnchor
	setNewImmutableTextAnchor: any
}

function ImmutableTextContainer(props: ImmutableTextContainerProps): JSX.Element {
	const { node, anchorId, anchorIds, newImmutableTextAnchorModal,
		setImmutableTextNewAnchorModal, newImmutableTextAnchor, setNewImmutableTextAnchor } = props
	const { isLoading, data, error } = useQuery([node.nodeId, node.nodeType], ImmutableTextNodeGateway.getNode)

	const [createNode] = useMutation(ImmutableTextNodeGateway.createNode, {
		onSuccess: () => queryCache.invalidateQueries([node.nodeId, node.nodeType])
	})

	if (isLoading) return <Spinner />

	if (error) return <div> {'An error has occurred: ' + error} </div>

	return (<div>
		<ImmutableTextWithAnchorsContainer
			node={data?.payload}
			anchorIds={anchorIds}
			anchorId={anchorId}
			createNode={text => createNode({
				nodeId: node.nodeId,
				text: text
			})}
			newImmutableTextAnchorModal={newImmutableTextAnchorModal}
			setImmutableTextNewAnchorModal={setImmutableTextNewAnchorModal}
			newImmutableTextAnchor={newImmutableTextAnchor}
			setNewImmutableTextAnchor={setNewImmutableTextAnchor}
		/>
	</div>
	)
}

export default ImmutableTextContainer;
