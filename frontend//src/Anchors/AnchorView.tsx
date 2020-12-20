import { Card, Elevation, Divider } from '@blueprintjs/core';
import { IAnchor, INode, successfulServiceResponse } from 'spectacle-interfaces';
import React from 'react';
import MediaAnchorGateway from '../Gateways/Media/MediaAnchorGateway';
import { queryCache, useQuery } from 'react-query';
import ImmutableTextAnchorGateway from '../Gateways/ImmutableText/ImmutableTextAnchorGateway';
import ImmutableTextNodeGateway from '../Gateways/ImmutableText/ImmutableTextNodeGateway';
import AnchorGateway from '../Gateways/AnchorGateway';

interface AnchorViewProps {
	anchor?: IAnchor
	anchorIds: string[]
	node: INode
	setAnchor: (anchor: IAnchor) => void
	setMediaPlayed?: any
	mediaDuration?: number
	mediaPlaying?: boolean
	setMediaPlaying?: any
	setMediaSkipUsingAnnotation: any
}

function convertTime(sec_num) {
	const hours: number = Math.floor(sec_num / 3600)
	const minutes: number = Math.floor((sec_num - (hours * 3600)) / 60)
	const seconds: number = +(sec_num - (hours * 3600) - (minutes * 60)).toFixed(0)
	let hoursStr: string = hours < 10 ? "0" + hours : hours.toString()
	let minStr: string = minutes < 10 ? "0" + minutes : minutes.toString()
	let secStr: string = seconds < 10 ? "0" + seconds : seconds.toString()
	if (hoursStr == "00") {
		return minStr + ':' + secStr
	}
	return hoursStr + ':' + minStr + ':' + secStr;
}

function AnchorView(props: AnchorViewProps): JSX.Element {
	const { anchor, anchorIds, node, setAnchor, setMediaPlayed, mediaDuration, mediaPlaying, setMediaPlaying, setMediaSkipUsingAnnotation } = props

	const seekTo = (seconds: number, duration: number) => {
		const played = seconds / duration
		setMediaPlayed(played)
		if (mediaPlaying === true) {
			setMediaPlaying(false)
		} else {
			setMediaPlaying(true)
		}
	}

	const mediaAnchorMap = useQuery([anchorIds, 'media-anchors'], MediaAnchorGateway.getAnchors).data?.payload

	const genericAnchorMap = useQuery([anchorIds, 'generic-anchors'], AnchorGateway.getAnchors).data?.payload

	const genericAnchors = genericAnchorMap ? Object.values(genericAnchorMap) : []
	const mediaAnchors = mediaAnchorMap ? Object.values(mediaAnchorMap) : []
	const immutableTextAnchorMap = useQuery([anchorIds, 'immutable-text-anchors'], ImmutableTextAnchorGateway.getAnchors).data?.payload
	const immutableTextNode = useQuery([node.nodeId, 'immutable-text'], ImmutableTextNodeGateway.getNode).data?.payload
	const immutableTextAnchors = immutableTextAnchorMap ? Object.values(immutableTextAnchorMap) : []

	const activeIndex = anchor ? genericAnchors.findIndex(anc => anc.anchorId === anchor.anchorId) : -1

	if (genericAnchors.length) {
		// media annotations
		if (genericAnchors[0].type === "media" && mediaAnchors.length > 0) {
			return (
				<div>
					{genericAnchors.map((a, index) =>
						<div key={a.anchorId}>
							<Card className={activeIndex === index ? "SelectedAnnotationCard" : "AnnotationCard"} interactive={true}
								elevation={activeIndex === index ? Elevation.TWO : Elevation.ZERO} onClick={e => setAnchor(a)}
								onDoubleClick={() => {
									setMediaSkipUsingAnnotation(true);
									seekTo(mediaAnchors[index].mediaTimeStamp, mediaDuration)
								}}>
								<h5 className="h5Title">{mediaAnchors[index] ? convertTime(mediaAnchors[index].mediaTimeStamp) : "00:00"}</h5>
								{genericAnchors[index].contentList.map((c, cIndex) =>
									<div key={cIndex}>
										<p><b>{genericAnchors[index].authorList[cIndex]}</b>: {c}</p>
										{(cIndex !== genericAnchors[index].contentList.length - 1) && <div className="AnnotationDivider"><Divider /></div>}
									</div>
								)}
							</Card>
						</div>
					)
					}
				</div >
			)
		}
		// immutableText annotations
		else if (immutableTextAnchors.length > 0) {
			return (
				<div>
					{genericAnchors.map((a, index) =>
						<div key={a.anchorId}>
							<Card className={activeIndex === index ? "SelectedAnnotationCard" : "AnnotationCard"} interactive={true}
								elevation={activeIndex === index ? Elevation.TWO : Elevation.ZERO} onClick={e => setAnchor(a)} >
								<h5 className="h5Title"> "
									{immutableTextNode && immutableTextAnchors[index] ?
										immutableTextNode.text.substring(immutableTextAnchors[index].start, Math.min((immutableTextAnchors[index].end + 1), immutableTextAnchors[index].start + 20)) : ''} "
									</h5>
								{genericAnchors[index].contentList.map((c, cIndex) =>
									<div key={cIndex}>
										<p><b>{genericAnchors[index].authorList[cIndex]}</b>: {c}</p>
										{(cIndex !== genericAnchors[index].contentList.length - 1) && <div className="AnnotationDivider"><Divider /></div>}
									</div>
								)}
							</Card>
						</div>
					)}
				</div>
			)
		}
		else {
			return (
				<div>
					{genericAnchors.map((a, index) =>
						<div key={a.anchorId}>
							<Card className={activeIndex === index ? "SelectedAnnotationCard" : "AnnotationCard"} interactive={true}
								elevation={activeIndex === index ? Elevation.TWO : Elevation.ZERO} onClick={e => setAnchor(a)} >
								{genericAnchors[index].contentList.map((c, cIndex) =>
									<div key={cIndex}>
										<h5 className="h5Title" style={{marginTop: "5px"}}><b>{genericAnchors[index].authorList[cIndex]}</b></h5>
										{c}
										{(cIndex !== genericAnchors[index].contentList.length - 1) && <div className="AnnotationDivider"><Divider /></div>}
									</div>
								)}
								
								
								{/* <h5 className="h5Title">{genericAnchors[index].authorList}</h5>
								<div>{genericAnchors[index].contentList[index]}7879797iuyiyijkj</div>
								<div className="AnnotationDivider"><Divider /></div> */}
							</Card>
						</div>
					)}
				</div>)
		}
	} else {
		return null
	}
}

export default AnchorView;


