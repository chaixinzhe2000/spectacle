import { H5, Button, Card, Elevation, Divider, Callout } from '@blueprintjs/core';
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

const { Panel } = Collapse;

interface RelatedLinksContainerProps {
	currentNodeId: string
}

function RelatedLinksContainer(props: RelatedLinksContainerProps): JSX.Element {
	const { currentNodeId } = props

	const getRelatedAnchorIds = (nodeLinks: ILink[]) => {
		let anchorIds = []
		console.log(nodeLinks)
		for (let link of nodeLinks) {
			if (link.srcAnchorId !== null) {
				anchorIds.push(link.srcAnchorId)
			} else if (link.destAnchorId !== null) {
				anchorIds.push(link.destAnchorId)
			}
		}
		return anchorIds
	}

	const getDestinationNodeIds = (relatedIAnchors: IAnchor[]) => {
		let array = []
		for (let anchor of relatedIAnchors) {
			array.push(anchor.nodeId)
		}
		return array
	}

	const nodeLinksMap = useQuery([currentNodeId, 'node-links'], LinkGateway.getNodeLinks).data?.payload
	const relatedAnchorIds: string[] = nodeLinksMap ? getRelatedAnchorIds(Object.values(nodeLinksMap)) : []

	console.log(nodeLinksMap)
	console.log(relatedAnchorIds)

	const relatedIAnchorsMap = useQuery([relatedAnchorIds, "related-anchors"], AnchorGateway.getAnchors).data?.payload
	const relatedIAnchors: IAnchor[] = relatedIAnchorsMap ? Object.values(relatedIAnchorsMap) :[]
	const destinationNodeIds = getDestinationNodeIds(relatedIAnchors)

	const [selectedRelatedAnchor, setSelectedRelatedAnchor]: [IAnchor, any] = useState(null)
	const activeIndex = selectedRelatedAnchor ? relatedIAnchors.findIndex(anc => anc.anchorId === selectedRelatedAnchor.anchorId) : -1
	
	const navigate = useNavigate()

	if (relatedIAnchors.length) {
		return (
			<div style={{width:"100%", minHeight: "fitContent", border:"1px lightgrey solid", padding:"10px", marginRight:"5px"}}>
				<Callout className="nodeTitle" icon={"link"} title={"Related Links"} intent={"success"}></Callout>
				{relatedIAnchors.map((a, index) =>
					<div key={a.anchorId}>
						<Card className={activeIndex === index ? "SelectedAnnotationCard" : "AnnotationCard"} interactive={true}
							elevation={activeIndex === index ? Elevation.TWO : Elevation.ZERO} onClick={e => setSelectedRelatedAnchor(a)}
							onDoubleClick={(e) => navigate(`/nodes/${destinationNodeIds[index]}`)}>
							<h5 className="h5Title">{destinationNodeIds[index]}</h5>
							{relatedIAnchors[index].contentList.map((c, cIndex) =>
								<div key={cIndex}>
									<p><b>{relatedIAnchors[index].authorList[cIndex]}</b>: {c}</p>
									{(cIndex !== relatedIAnchors[index].contentList.length - 1) && <div className="AnnotationDivider"><Divider /></div>}
								</div>
							)}
						</Card>
					</div>
				)
				}
			</div >
		)
	} else {
		return <div style={{width:"100%", minHeight: "fitContent", border:"1px lightgrey solid", padding:"10px", marginRight:"5px"}}>
			<Callout className="nodeTitle" icon={"link"} title={"Related Links are Empty"} intent={"danger"}></Callout>
		</div>
	}
}

export default RelatedLinksContainer;


