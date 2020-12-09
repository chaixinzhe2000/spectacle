import { H5, Button, Card, Elevation, Divider } from '@blueprintjs/core';
import { failureServiceResponse, IAnchor, IImmutableTextAnchor, IImmutableTextNode, ILink, IMediaAnchor, INode, IServiceResponse } from 'spectacle-interfaces';
import React, { useState } from 'react';
import { Collapse } from 'antd';
import { Accordion, Icon } from 'semantic-ui-react'
import MediaAnchorGateway from '../Gateways/Media/MediaAnchorGateway';

const { Panel } = Collapse;

interface AnchorViewProps {
	anchors: IAnchor[]
	anchor?: IAnchor
	setAnchor: (anchor: IAnchor) => void
	mediaAnchors?: IMediaAnchor[]
	immutableTextAnchors?: IImmutableTextAnchor[]
	immutableTextNode?: IImmutableTextNode
	setMediaPlayed?: any
	mediaDuration?: number
    mediaPlaying?: boolean
    setMediaPlaying?: any
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
	const { anchors, anchor, setAnchor, mediaAnchors, immutableTextAnchors, immutableTextNode, setMediaPlayed, mediaDuration, mediaPlaying, setMediaPlaying } = props

	const seekTo = (seconds: number, duration: number) => {
		const played = seconds / duration
		console.log(played)
		setMediaPlayed(played)
		if (mediaPlaying === true) {
			setMediaPlaying(false)
		} else {
			setMediaPlaying(true)
		}
	}

	const activeIndex = anchor ? anchors.findIndex(anc => anc.anchorId === anchor.anchorId) : -1

	if (anchors.length) {
		// media annotations
		if (anchors[0].type === "media" && mediaAnchors.length > 0) {
			return (
				<div>
					{anchors.map((a, index) =>
						<div key={a.anchorId}>
							<Card className={activeIndex === index ? "SelectedAnnotationCard" : "AnnotationCard"} interactive={true}
								elevation={activeIndex === index ? Elevation.TWO : Elevation.ZERO} onClick={e => setAnchor(a)}
								onDoubleClick={() => {seekTo(mediaAnchors[index].mediaTimeStamp, mediaDuration)}}>
								<h5 className="h5Title">{mediaAnchors[index] ? convertTime(mediaAnchors[index].mediaTimeStamp) : "00:00"}</h5>
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
		}
		// Non-media annotations
		else {
			if (immutableTextAnchors.length > 0) {
				return (
					<div>
						{anchors.map((a, index) =>
							<div key={a.anchorId}>
								<Card className={activeIndex === index ? "SelectedAnnotationCard" : "AnnotationCard"} interactive={true}
									elevation={activeIndex === index ? Elevation.TWO : Elevation.ZERO} onClick={e => setAnchor(a)} >
									<h5 className="h5Title"> "
									{immutableTextNode && immutableTextAnchors[index] ?
											immutableTextNode.text.substring(immutableTextAnchors[index].start, Math.min((immutableTextAnchors[index].end + 1), immutableTextAnchors[index].start + 20)) : ''} "
									</h5>
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

export default AnchorView;


