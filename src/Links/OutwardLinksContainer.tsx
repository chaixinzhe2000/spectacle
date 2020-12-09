import { H5, Button, Card, Elevation, Divider } from '@blueprintjs/core';
import { failureServiceResponse, IAnchor, IImmutableTextAnchor, IImmutableTextNode, ILink, IMediaAnchor, INode, IServiceResponse } from 'spectacle-interfaces';
import React, { useState } from 'react';
import { queryCache, useMutation, useQuery } from 'react-query';
import { Collapse } from 'antd';
import { Accordion, Icon } from 'semantic-ui-react'
import MediaAnchorGateway from '../Gateways/Media/MediaAnchorGateway';
import AnchorGateway from '../Gateways/AnchorGateway';
import LinkGateway from '../Gateways/LinkGateway';
import NodeGateway from '../Gateways/NodeGateway';
import { useNavigate } from 'react-router';
import { link } from 'fs';
import HypertextSdk from '../HypertextSdk';

const { Panel } = Collapse;

interface OutwardLinksContainerProps {
	node: INode
}

function OutwardLinksContainer(props: OutwardLinksContainerProps): JSX.Element {
	const { node } = props

	const getOppositeNodeIds = (anchorIds: string[], validLinks: ILink[]) => {
		let oppositeNodeIds: string[] = []
		if (anchorIds.length === validLinks.length) {
			for (let i = 0; i < anchorIds.length; i++) {
                console.log("VALIDLINKS ", i)
                console.log(validLinks[i])
				if (validLinks[i].srcNodeId !== null) {
					oppositeNodeIds.push(validLinks[i].srcNodeId)
				} else if (validLinks[i].destNodeId !== null) {
					oppositeNodeIds.push(validLinks[i].destNodeId)
				}
			}
			return oppositeNodeIds
		} else {
			return []
		}
	}

    // const invalidateAllQueries = () => {
    //     queryCache.invalidateQueries([currentNodeId, 'node-anchors']);
    //     queryCache.invalidateQueries([nodeAnchorsMap ? Object.values(nodeAnchorsMap): [], 'node-anchor-links']);
    //     queryCache.invalidateQueries([destinationNodeIds ? destinationNodeIds : [], 'opposite-node']);
    // }

    const nodeAnchorsMap = useQuery([node.nodeId, 'outward-node-anchors'], AnchorGateway.getNodeAnchors).data?.payload
    console.log("NODE ANCHORS MAP")
    console.log(nodeAnchorsMap)
	const bulkQuery = useQuery([nodeAnchorsMap ? Object.values(nodeAnchorsMap): [], 'node-anchor-links'], HypertextSdk.getOutwardAnchors).data
	console.log("BULK")
	console.log(bulkQuery)
	
	const anchors: IAnchor[] = bulkQuery ? bulkQuery['data']['anchors'] : []
	const anchorIds: string[] = bulkQuery ? bulkQuery['data']['anchorIds'] : []
	const links: ILink[] = bulkQuery ? bulkQuery['data']['links'] : []
	const destinationNodeIds: string[] = anchorIds && links ? getOppositeNodeIds(anchorIds, links) : []
	console.log("ANCHOR")
	console.log(anchors)
	console.log("NODE ID")
	console.log(destinationNodeIds)
	const destinationNodes = useQuery([destinationNodeIds ? destinationNodeIds : [], 'opposite-node'], HypertextSdk.getNode).data
	const nodes = destinationNodeIds ? destinationNodes : []

	
	const [selectedRelatedAnchor, setSelectedRelatedAnchor]: [IAnchor, any] = useState(null)
	const activeIndex = selectedRelatedAnchor ? anchors.findIndex(anc => anc.anchorId === selectedRelatedAnchor.anchorId) : -1

	const navigate = useNavigate()

	if (anchors.length) {
		return (
			<div>
				{anchors.map((a, index) =>
					<div key={a.anchorId}>
						<Card className={activeIndex === index ? "SelectedAnnotationCard" : "AnnotationCard"} interactive={true}
							elevation={activeIndex === index ? Elevation.TWO : Elevation.ZERO} onClick={e => setSelectedRelatedAnchor(a)}
							onDoubleClick={(e) => {navigate(`/nodes/${destinationNodeIds[index]}`)}}>
							<h5 className="h5Title">{destinationNodeIds[index]}</h5>
							{anchors[index].contentList.map((c, cIndex) =>
								<div key={cIndex}>
									<p><b>{anchors[index].authorList[cIndex]}</b>: {c}</p>
									{(cIndex !== anchors[index].contentList.length - 1) && <div className="AnnotationDivider"><Divider /></div>}
								</div>
							)}
						</Card>
					</div>
				)
				}
			</div >
		)
	} else {
		return <div>
		</div>
	}
}

export default OutwardLinksContainer;


