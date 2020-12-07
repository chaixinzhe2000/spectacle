import { H5, Button, Card, Elevation, Divider } from '@blueprintjs/core';
import { failureServiceResponse, IAnchor, IImmutableTextAnchor, IImmutableTextNode, ILink, IMediaAnchor, INode, IServiceResponse } from 'spectacle-interfaces';
import React, { useState } from 'react';
import { Collapse } from 'antd';
import { Accordion, Icon } from 'semantic-ui-react'
import LinkView from '../Links/LinkView';
import LinkContainer from '../Links/LinkContainer';
import MediaAnchorGateway from '../Gateways/Media/MediaAnchorGateway';

const { Panel } = Collapse;

interface AnchorViewProps {
	anchors: IAnchor[]
	getNode: (nodeId: string) => IServiceResponse<INode>
	anchor?: IAnchor
	setAnchor: (anchor: IAnchor) => void
	setPreviewAnchor: (anchor: IAnchor) => void
	linkMap: { [anchorId: string]: ILink[] }
	canManageLinks: boolean
	mediaAnchors?: IMediaAnchor[]
	immutableTextAnchors?: IImmutableTextAnchor[]
	immutableTextNode?: IImmutableTextNode
}

function AnchorView(props: AnchorViewProps): JSX.Element {
	const { anchors, anchor, setAnchor, getNode, setPreviewAnchor, linkMap, canManageLinks, mediaAnchors, immutableTextAnchors, immutableTextNode } = props
	if (anchors.length) {
		// media annotations
		if (anchors[0].type === "media" && mediaAnchors.length > 0) {
			return (
				<div>
					{anchors.map((a, index) =>
						<div key={a.anchorId}>
							<Card className="AnnotationCard" interactive={true} elevation={Elevation.ZERO}>
								<h5><a href="#">At {mediaAnchors[index].mediaTimeStamp} seconds</a></h5>
								{anchors[index].contentList.map((c, cIndex) =>
									<div key={cIndex}>
										<p><b>{anchors[index].authorList[cIndex]}</b>: {c}</p>
										{(cIndex !== anchors[index].contentList.length - 1) && <div className="AnnotationDivider"><Divider /></div>}
									</div>
								)}
							</Card>
						</div>
					)}
				</div>
			)
		}
		// Non-media annotations
		else {
			if (immutableTextAnchors.length > 0) {
				return (
					<div>
						{anchors.map((a, index) =>
							<div key={a.anchorId}>
								<Card className="AnnotationCard" interactive={true} elevation={Elevation.ZERO}>
									<h5><a href="#">At "
									{immutableTextNode && immutableTextAnchors[index] ?
											immutableTextNode.text.substring(immutableTextAnchors[index].start, Math.min((immutableTextAnchors[index].end + 1), immutableTextAnchors[index].start + 20)) : ''} "
									</a></h5>
									{anchors[index].contentList.map((c, cIndex) =>
										<div key={cIndex}>
											<p><b>{anchors[index].authorList[cIndex]}</b>: {c}</p>
											{(cIndex !== anchors[index].contentList.length - 1) && <div className="AnnotationDivider"><Divider /></div>}
										</div>
									)}
								</Card>
							</div>
						)}
					</div>
				)
			} else {
				return null
			}
		}

	} else {
		return null
	}
	// if (anchors.length)
	//     return (
	//         <Accordion onMouseLeave={() => setPreviewAnchor(null)} styled fluid>
	//             {anchors.map((a, index) => <div key={a.anchorId}>
	//                 <Accordion.Title
	//                     active={activeIndex === index}
	//                     index={index}
	//                     onClick={e => setAnchor(a)}
	//                     onMouseEnter={() => setPreviewAnchor(a)}
	//                 >
	//                     <Icon name='dropdown' />
	//                     {a.contentList[0]} ({linkMap[a.anchorId] ? linkMap[a.anchorId].length : 0} {linkMap[a.anchorId] ? linkMap[a.anchorId].length === 1 ? 'Link' : 'Links' : 'Links'})
	//                 </Accordion.Title>
	//                 {
	//                     canManageLinks && <Accordion.Content active={activeIndex === index}>
	//                         <LinkContainer anchor={a} />
	//                     </Accordion.Content>
	//                 }
	//             </div>
	//             )}
	//         </Accordion>
	//     )
	// else
	//     return null
}

export default AnchorView;


