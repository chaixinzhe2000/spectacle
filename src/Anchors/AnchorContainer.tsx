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


interface AnchorContainerProps {
    selectedAnchor: IAnchor
    node: INode
    setSelectedAnchor: (anchor: IAnchor) => void
    setPreviewAnchor: (anchor: IAnchor) => void
    setAnchorIds: (anchorIds: string[]) => void
    clearSelection: () => void
}

function AnchorContainer(props: AnchorContainerProps): JSX.Element {
    const { node, selectedAnchor, setSelectedAnchor, setPreviewAnchor, clearSelection, setAnchorIds } = props

    const [deleteAnchor] = useMutation(HypertextSdk.deleteAnchor, {
        onSuccess: (data) => queryCache.invalidateQueries([data, 'anchors']) 
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

    const linkAnchorMap: {[anchorId: string]: ILink[] } = {}
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
	
    return (
        <div style={{margin: 'auto', marginTop: '39px', width: '100%', padding: '10px', border: '1px solid lightgrey'}}>
            <H5> Anchors </H5>
            {selectedAnchor && <> <ButtonGroup>
                <Button intent="danger" minimal disabled={selectedAnchor ? false : true} onClick={(e) => {
                    deleteAnchor(selectedAnchor.anchorId)
                    setSelectedAnchor(null)
                }}> Delete Anchor </Button>
                <Button intent="warning" minimal disabled={selectedAnchor ? false : true} onClick={(e) => {
                    clearSelection()
                }}> Clear Selection </Button>      
            </ButtonGroup>
            <Divider />
            </>
        }

        <AnchorView
            canManageLinks={true} 
            anchors={anchors}
            anchor={selectedAnchor}
            setPreviewAnchor={anc => setPreviewAnchor(anc) }
            setAnchor={anc => setSelectedAnchor(anc)}
            linkMap={linkAnchorMap}
            getNode={nid => getNode(nid)}
            mediaAnchorTimeStamps = {mediaAnchorMap ? Object.values(mediaAnchorMap) : []}
        />
    </div>)

}

export default AnchorContainer;
