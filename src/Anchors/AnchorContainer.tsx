import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, ButtonGroup, Divider, H5 } from '@blueprintjs/core';
import AnchorView from './AnchorView';
import { IAnchor, ILink, INode, IServiceResponse, newFilePath, ROOT_ID, successfulServiceResponse } from 'spectacle-interfaces';
import { queryCache, useMutation, useQuery } from 'react-query';
import HypertextSdk from '../HypertextSdk';
import AnchorGateway from '../Gateways/AnchorGateway';
import { getNode } from '../NodeManager/containers/NodeManagerContainer';
import LinkGateway from '../Gateways/LinkGateway';
import MediaAnchorGateway from '../Gateways/Media/MediaAnchorGateway';
import ImmutableTextAnchorGateway from '../Gateways/ImmutableText/ImmutableTextAnchorGateway';
import ImmutableTextNodeGateway from '../Gateways/ImmutableText/ImmutableTextNodeGateway';


interface AnchorContainerProps {
	selectedAnchor: IAnchor
	node: INode
	setSelectedAnchor: (anchor: IAnchor) => void
	setPreviewAnchor: (anchor: IAnchor) => void
	setAnchorIds: (anchorIds: string[]) => void
	clearSelection: () => void
	mediaDuration: number
	setMediaPlayed: any
	mediaPlaying: boolean
	setMediaPlaying: any
	setNewMediaAnchorModal: any
}

function AnchorContainer(props: AnchorContainerProps): JSX.Element {
	const { node, selectedAnchor, setSelectedAnchor, setPreviewAnchor, clearSelection,
		setAnchorIds, mediaDuration, setMediaPlayed, mediaPlaying, setMediaPlaying, setNewMediaAnchorModal } = props

	const [deleteAnchor] = useMutation(HypertextSdk.deleteAnchor, {
		onSuccess: () => {
			queryCache.invalidateQueries([node.nodeId, 'anchors']);
			queryCache.invalidateQueries([anchorIds, 'media-anchors']);
			queryCache.invalidateQueries([anchorIds, 'immutable-text-anchors'])
		}
	})

	// Get Node Anchors, On Success Cache Anchors by Anchor ID
	const anchorMap = useQuery([node.nodeId, 'anchors'], AnchorGateway.getNodeAnchors, {
		onSuccess: (data) => {
			if (data.success) {
				const anchors = data.payload
				setAnchorIds(Object.keys(anchors))
				Object.keys(anchors).forEach(aid => queryCache.setQueryData(aid, successfulServiceResponse(anchors[aid])))
			}
		},
		enabled: node
	}).data?.payload
	console.log(anchorMap)


	const linkNodeMap = useQuery([node.nodeId, 'links'], LinkGateway.getNodeLinks).data?.payload

	const linkAnchorMap: { [anchorId: string]: ILink[] } = {}
	if (linkNodeMap) {
		Object.values(linkNodeMap).forEach(link => {
			if (linkAnchorMap[link.srcAnchorId]) {
				linkAnchorMap[link.srcAnchorId].push(link)
			} else {
				linkAnchorMap[link.srcAnchorId] = [link]
			}

			if (linkAnchorMap[link.destAnchorId]) {
				linkAnchorMap[link.destAnchorId].push(link)
			} else {
				linkAnchorMap[link.destAnchorId] = [link]
			}
		})
	}

	const anchors = anchorMap ? Object.values(anchorMap) : []
	const anchorIds = anchorMap ? Object.keys(anchorMap) : []

	const mediaAnchorMap = useQuery([anchorIds, 'media-anchors'], MediaAnchorGateway.getAnchors, {
		onSuccess: (data) => {
			if (data.success) {
				const anchors = data.payload
				setAnchorIds(Object.keys(anchors))
				Object.keys(anchors).forEach(aid => queryCache.setQueryData(aid, successfulServiceResponse(anchors[aid])))
			}
		},
		enabled: node
	}).data?.payload

	const immutableTextAnchorMap = useQuery([anchorIds, 'immutable-text-anchors'], ImmutableTextAnchorGateway.getAnchors, {
		onSuccess: (data) => {
			if (data.success) {
				const anchors = data.payload
				setAnchorIds(Object.keys(anchors))
				Object.keys(anchors).forEach(aid => queryCache.setQueryData(aid, successfulServiceResponse(anchors[aid])))
			}
		},
		enabled: node
	}).data?.payload

	const immutableTextNode = useQuery([node.nodeId, 'immutable-text'], ImmutableTextNodeGateway.getNode).data?.payload

	return (
		<div style={{ margin: 'auto', marginTop: '39px', width: '100%', padding: '10px', border: '1px solid lightgrey' }}>
			<H5> Annotations </H5>
			{<div> <ButtonGroup>
				<Button intent="primary" icon="add-to-artifact" minimal disabled={false} onClick={(e) => {
					setNewMediaAnchorModal(true)
				}}> Add New </Button>
				<Button intent="success" icon="paperclip" minimal disabled={selectedAnchor ? false : true} onClick={(e) => {
					deleteAnchor(selectedAnchor.anchorId)
					setSelectedAnchor(null)
				}}> Follow Up </Button>
				<Button intent="danger" icon="graph-remove" minimal disabled={selectedAnchor ? false : true} onClick={(e) => {
					deleteAnchor(selectedAnchor.anchorId)
					setSelectedAnchor(null)
				}}> Delete </Button>
				<Button intent="warning" icon="clean" minimal disabled={selectedAnchor ? false : true} onClick={(e) => {
					clearSelection()
				}}> Clear </Button>
			</ButtonGroup>
				<Divider />
			</div>
			}

			<AnchorView
				canManageLinks={true}
				anchors={anchors}
				anchor={selectedAnchor}
				setPreviewAnchor={anc => setPreviewAnchor(anc)}
				setAnchor={anc => setSelectedAnchor(anc)}
				linkMap={linkAnchorMap}
				getNode={nid => getNode(nid)}
				mediaAnchors={mediaAnchorMap ? Object.values(mediaAnchorMap) : []}
				immutableTextAnchors={immutableTextAnchorMap ? Object.values(immutableTextAnchorMap) : []}
				immutableTextNode={immutableTextNode ? immutableTextNode : null}
				setMediaPlayed={setMediaPlayed}
				mediaDuration={mediaDuration}
				mediaPlaying={mediaPlaying}
				setMediaPlaying={setMediaPlaying}
			/>
		</div>)

}

export default AnchorContainer;
