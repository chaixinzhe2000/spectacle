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

function convertTime(sec_num) {

	let hours = Math.floor(sec_num / 3600);
	let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	let seconds = +(sec_num - (hours * 3600) - (minutes * 60)).toFixed(0);
	let hoursStr: string
	let minStr: string
	let secStr: string
	if (hours < 10) { 
		hoursStr = "0" + hours
	} else {
		hoursStr = hours.toString()
	}
	if (minutes < 10) { 
		minStr = "0" + minutes
	} else {
		minStr = minutes.toString()
	}
	if (seconds < 10) { 
		secStr = "0" + seconds
	} else {
		secStr = seconds.toString()
	}
	if (hoursStr == "00") {
		return minStr + ':' + secStr
	}
	return hoursStr + ':' + minStr + ':' + secStr;
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
								<h5><a href="#">{convertTime(mediaAnchors[index].mediaTimeStamp)}</a></h5>
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
									<h5><a href="#">"
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
}

export default AnchorView;


