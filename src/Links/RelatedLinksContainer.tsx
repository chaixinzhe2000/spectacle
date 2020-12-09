import { H5, Button, Card, Elevation, Divider } from '@blueprintjs/core';
import { failureServiceResponse, IAnchor, IImmutableTextAnchor, IImmutableTextNode, ILink, IMediaAnchor, INode, IServiceResponse } from 'spectacle-interfaces';
import React, { useState } from 'react';
import { queryCache, useMutation, useQuery } from 'react-query';
import { Collapse } from 'antd';
import { Accordion, Icon } from 'semantic-ui-react'
import LinkView from '../Links/LinkView';
import LinkContainer from '../Links/LinkContainer';
import MediaAnchorGateway from '../Gateways/Media/MediaAnchorGateway';
import AnchorGateway from '../Gateways/AnchorGateway';
import LinkGateway from '../Gateways/LinkGateway';
import NodeGateway from '../Gateways/NodeGateway';
import { useNavigate } from 'react-router';

const { Panel } = Collapse;

interface RelatedLinksContainerProps {
    currentNodeId: string
	// relatedAnchors: IAnchor[]
	// getNode: (nodeId: string) => IServiceResponse<INode>
	// anchor?: IAnchor
	// setAnchor: (anchor: IAnchor) => void
	// setPreviewAnchor: (anchor: IAnchor) => void
	// linkMap: { [anchorId: string]: ILink[] }
	// canManageLinks: boolean
	// mediaAnchors?: IMediaAnchor[]
	// immutableTextAnchors?: IImmutableTextAnchor[]
	// immutableTextNode?: IImmutableTextNode
	// setMediaPlayed?: any
	// mediaDuration?: number
	// mediaPlaying?: boolean
	// setMediaPlaying?: any
}

function RelatedLinksContainer(props: RelatedLinksContainerProps): JSX.Element {
    const { currentNodeId } = props
    
    let relatedAnchorIds = []
    let relatedIAnchors = []
    let destinationNodeIds = []
    const { data: relatedLinksData, isLoading: relatedLinksLoading } = useQuery([currentNodeId, "relatedLinks"], LinkGateway.getNodeLinks, {
        onSuccess: (data) => {if (data.success){
            let nodeLinks = Object.values(data.payload); 
            console.log("Success!")
            relatedAnchorIds = getRelatedAnchorIds(nodeLinks);
        }}
    })
    // console.log(relatedLinksData)
    const getRelatedAnchorIds = (nodeLinks) => {
        let array = []
        console.log("RUNNING GETRELATEDANCHORIDS")
        console.log(nodeLinks)
        for (let link of nodeLinks) {
            if (link.srcAnchorId !== undefined){
                array.push(link.srcAnchorId)
            } else if (link.destAnchorId !== undefined) {
                array.push(link.destAnchorId)
            } else {
            }
        }
        return array
    }
    
    
    const { data: relatedAnchorsData, isLoading: relatedAnchorsLoading } = useQuery([relatedAnchorIds, "relatedAnchors"], AnchorGateway.getAnchors, {
        onSuccess: (data) => {if (data.success){
            relatedIAnchors= Object.values(data.payload); 
            destinationNodeIds = getDestinationNodeIds(relatedIAnchors)
        }}
    })
    
    const getDestinationNodeIds = (relatedIAnchors) => {
        // console.log("RUNNING GETOTHERNODEIDS")
        // console.log(relatedIAnchors)
        let array = []
        for (let anchor of relatedIAnchors) {
            array.push(anchor.nodeId)
        }
        return array
    }    
    const [selectedRelatedAnchor, setSelectedRelatedAnchor] : [IAnchor, any] = useState(null)
    const activeIndex = selectedRelatedAnchor ? relatedIAnchors.findIndex(anc => anc.anchorId === selectedRelatedAnchor.anchorId) : -1  
    const navigate = useNavigate()

    // console.log("HIHIHIHIIHIHIHIHIHIHIHIHIIHIHI")
    // console.log(relatedIAnchors.length)
    if (relatedIAnchors.length){
        return (
            <div>
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
        return (<div>hihi!</div>)
    }
}
	// if (anchors.length) {
	// 	// media annotations
	// 	if (anchors[0].type === "media" && mediaAnchors.length > 0) {
	// 		return (
	// 			<div>
	// 				{anchors.map((a, index) =>
	// 					<div key={a.anchorId}>
	// 						<Card className={activeIndex === index ? "SelectedAnnotationCard" : "AnnotationCard"} interactive={true}
	// 							elevation={activeIndex === index ? Elevation.TWO : Elevation.ZERO} onClick={e => setAnchor(a)}
	// 							onDoubleClick={() => seekTo(mediaAnchors[index].mediaTimeStamp, mediaDuration)}>
	// 							<h5 className="h5Title">{mediaAnchors[index] ? convertTime(mediaAnchors[index].mediaTimeStamp) : "00:00"}</h5>
	// 							{anchors[index].contentList.map((c, cIndex) =>
	// 								<div key={cIndex}>
	// 									<p><b>{anchors[index].authorList[cIndex]}</b>: {c}</p>
	// 									{(cIndex !== anchors[index].contentList.length - 1) && <div className="AnnotationDivider"><Divider /></div>}
	// 								</div>
	// 							)}
	// 						</Card>
	// 					</div>
	// 				)
	// 				}
	// 			</div >
	// 		)
	// 	}
	// 	// Non-media annotations
	// 	else {
	// 		if (immutableTextAnchors.length > 0) {
	// 			return (
	// 				<div>
	// 					{anchors.map((a, index) =>
	// 						<div key={a.anchorId}>
	// 							<Card className={activeIndex === index ? "SelectedAnnotationCard" : "AnnotationCard"} interactive={true}
	// 								elevation={activeIndex === index ? Elevation.TWO : Elevation.ZERO} onClick={e => setAnchor(a)} >
	// 								<h5 className="h5Title"> "
	// 								{immutableTextNode && immutableTextAnchors[index] ?
	// 										immutableTextNode.text.substring(immutableTextAnchors[index].start, Math.min((immutableTextAnchors[index].end + 1), immutableTextAnchors[index].start + 20)) : ''} "
	// 								</h5>
	// 								{anchors[index].contentList.map((c, cIndex) =>
	// 									<div key={cIndex}>
	// 										<p><b>{anchors[index].authorList[cIndex]}</b>: {c}</p>
	// 										{(cIndex !== anchors[index].contentList.length - 1) && <div className="AnnotationDivider"><Divider /></div>}
	// 									</div>
	// 								)}
	// 							</Card>
	// 						</div>
	// 					)}
	// 				</div>
	// 			)
	// 		} else {
	// 			return null
	// 		}
	// 	}
	// } else {
	// 	return null
	// }
// }

// const activeIndex = anchor ? anchors.findIndex(anc => anc.anchorId === anchor.anchorId) : -1

//     if (anchors.length)
//         return (
//             <Accordion onMouseLeave={() => setPreviewAnchor(null)} styled fluid>
//                 {anchors.map((a, index) => <div key={a.anchorId}>
//                         <Accordion.Title
//                             active={activeIndex === index}
//                             index={index}
//                             onClick={e => setAnchor(a)}
//                             onMouseEnter={() => setPreviewAnchor(a)}
//                         >
//                         <Icon name='dropdown' />
//                         {a.label} ({linkMap[a.anchorId] ? linkMap[a.anchorId].length : 0} {linkMap[a.anchorId] ? linkMap[a.anchorId].length === 1 ? 'Link' : 'Links' : 'Links' })
//                     </Accordion.Title>
//                     {
//                         canManageLinks && <Accordion.Content active={activeIndex === index}>
//                             <LinkContainer anchor={a} />
//                         </Accordion.Content>
//                     }
//                     </div>
//                 )}
//         </Accordion>
//     )
//     else
// 		return null

export default RelatedLinksContainer;


