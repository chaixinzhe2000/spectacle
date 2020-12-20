import React, { useEffect, useState } from 'react';
import { failureServiceResponse, IAnchor, ILink, INode, IServiceResponse, newFilePath, ROOT_ID } from 'spectacle-interfaces';
import { queryCache, useMutation, useQuery } from 'react-query';
import LinkGateway from '../Gateways/LinkGateway';
import AddLinkModal from './AddLinkModal';
import { generateLinkId } from '../NodeManager/helpers/generateNodeId';
import AnchorGateway from '../Gateways/AnchorGateway';
import NodeGateway from '../Gateways/NodeGateway';
import { getNode } from '../NodeManager/containers/NodeManagerContainer';


async function fetchRoot(nodeId: string) {
    return await NodeGateway.getNodeByPath(newFilePath([]))
}

export const getAnchor = (anchorId: string): IServiceResponse<IAnchor> => {
    const sr: IServiceResponse<IAnchor> = queryCache.getQueryData(anchorId)
    if (sr) {
        return sr
    }
    return failureServiceResponse("Anchor not in cache.")
}

interface LinkContainerProps {
    node: INode
    anchor: IAnchor
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

function AddLinkModalContainer(props: LinkContainerProps): JSX.Element {
    const { node, anchor, isOpen, setIsOpen } = props
    const [destNodeId, setDestinationNodeId]: [string, any] = useState('')

    const rootResponse = useQuery(ROOT_ID, fetchRoot).data

    const { data, refetch, isLoading } = useQuery([destNodeId, 'anchors'], AnchorGateway.getNodeAnchors, {
        enabled: destNodeId !== ''
    })

    const [createLink] = useMutation(LinkGateway.createLink, {
        onSuccess: () => {queryCache.invalidateQueries([anchor.anchorId, 'links'])}

    })

    function linkGenerator(source: IAnchor, destination: any):ILink {
        if (destination.anchorId !== undefined && destination.contentList !== undefined && destination.type !== undefined){
            // we know destination is an anchor
            return {
                linkId: generateLinkId(),
                srcAnchorId: source.anchorId,
                destAnchorId: destination.anchorId
            }
        } else if (destination.nodeType !== undefined && destination.filePath !== undefined && destination.children !== undefined && destination.label !== undefined) {
            // we know destination is a node
            return {
                linkId: generateLinkId(),
                srcAnchorId: source.anchorId,
                destNodeId: destination.nodeId
            }
        } else {
            return null
        }
    }

    if (anchor)
        return (
            <AddLinkModal
                anchor={anchor}
                getNode={getNode}
                onCreate={destination => {
                    createLink(linkGenerator(anchor, destination))
                    queryCache.invalidateQueries([anchor?.anchorId, 'links'])
                    queryCache.invalidateQueries([node.nodeId, 'outward-node-anchors'])
                    setIsOpen(false)
                }}
                isLoading={isLoading}
                node={rootResponse && rootResponse.success ? rootResponse.payload : null}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                anchors={data?.success ? Object.values(data.payload) : []}
                selectNode={node => {
                    setDestinationNodeId(node.nodeId)
                    refetch()
                }} />
        )
    else return null
}

export default AddLinkModalContainer;
