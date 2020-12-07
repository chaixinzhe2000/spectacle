import React, { useEffect, useState } from 'react';
import { queryCache, useMutation, useQuery } from 'react-query';
import { INode } from 'spectacle-interfaces';
import ImmutableTextNodeGateway from '../Gateways/ImmutableText/ImmutableTextNodeGateway';
import { Spinner } from '@blueprintjs/core';
import ImmutableTextWithAnchorsContainer from './MediaWithAnchorsContainer';
import MediaNodeGateway from '../Gateways/Media/MediaNodeGateway';
import MediaWithAnchorsContainer from './MediaWithAnchorsContainer';

interface MediaContainerProps {
	node: INode
	anchorId: string
	anchorIds: string[]
}

function MediaContainer(props: MediaContainerProps): JSX.Element {
	const { node, anchorId, anchorIds } = props
	const { isLoading, data, error } = useQuery([node.nodeId, node.nodeType], MediaNodeGateway.getNode)

	const [createNode] = useMutation(MediaNodeGateway.createNode, {
		onSuccess: () => queryCache.invalidateQueries([node.nodeId, node.nodeType])
	})

	if (isLoading) return <Spinner />

	if (error) return <div> {'An error has occurred: ' + error} </div>

	return (<div>
		<MediaWithAnchorsContainer
			node={data?.payload}
			anchorIds={anchorIds}
			anchorId={anchorId}
			createNode={mediaUrl => createNode({
				nodeId: node.nodeId,
				mediaUrl: mediaUrl
			})}
		/>
	</div>
	)
}

export default MediaContainer;
