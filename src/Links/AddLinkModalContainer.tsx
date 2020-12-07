import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, ButtonGroup, Divider } from '@blueprintjs/core';
import { failureServiceResponse, IAnchor, ILink, INode, IServiceResponse, newFilePath, ROOT_ID } from 'spectacle-interfaces';
import { queryCache, useMutation, useQuery } from 'react-query';
import LinkGateway from '../Gateways/LinkGateway';
import AddLinkModal from './AddLinkModal';
import { generateLinkId } from '../NodeManager/helpers/generateNodeId';
import AnchorGateway from '../Gateways/AnchorGateway';
import NodeGateway from '../Gateways/NodeGateway';
import LinkView from './LinkView';
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
    anchor: IAnchor
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

function AddLinkModalContainer(props: LinkContainerProps): JSX.Element {
  const { anchor, isOpen, setIsOpen } = props
  const [destNodeId, setDestinationNodeId]: [string, any] = useState('')

  const rootResponse = useQuery(ROOT_ID, fetchRoot).data

  const { data, refetch, isLoading } = useQuery([destNodeId, 'anchors'], AnchorGateway.getNodeAnchors, {
    enabled: destNodeId !== ''
  })

  const [createLink] = useMutation(LinkGateway.createLink, {
    onSuccess: () => queryCache.invalidateQueries([anchor.anchorId, 'links'])
  })

  if (anchor)
    return (
              <AddLinkModal
                anchor={anchor}
                getNode={getNode}
                onCreate={destAnchor => {
                  createLink({
                    linkId: generateLinkId(),
                    srcNodeId: anchor.nodeId,
                    srcAnchorId: anchor.anchorId,
                    destAnchorId: destAnchor.anchorId,
                    destNodeId: destAnchor.nodeId
                  })
                  queryCache.invalidateQueries([anchor?.anchorId, 'links'])
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
                }}/>
    )
  else return null
}

export default AddLinkModalContainer;
