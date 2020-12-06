

import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Divider, Spinner } from '@blueprintjs/core';
import { failureServiceResponse, IAnchor, ILink, IServiceResponse, newFilePath } from 'spectacle-interfaces';
import { queryCache, useMutation, useQuery } from 'react-query';
import LinkGateway from '../Gateways/LinkGateway';
import NodeGateway from '../Gateways/NodeGateway';
import LinkView from './LinkView';
import { getNode } from '../NodeManager/containers/NodeManagerContainer';
import AddLinkModalContainer from './AddLinkModalContainer';
import AnchorGateway from '../Gateways/AnchorGateway';


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
}

function LinkContainer(props: LinkContainerProps): JSX.Element {
  const { anchor } = props
  const [link, setLink]: [ILink, any] = useState(null)
  const [newLinkModal, setNewLinkModal]: [boolean, any] = useState(false)

  const { isLoading, data } = useQuery([anchor?.anchorId, 'links'], LinkGateway.getAnchorLinks, {
    enabled: anchor,
  })

  let links = []
  if (data) {
    links =  data.success ? Object.values(data.payload) : []
  }


  const [deleteLink] = useMutation(LinkGateway.deleteLink, {
    onSuccess: () => {
      setLink(null) 
      queryCache.invalidateQueries([anchor.anchorId, 'links'])
    }
  })


  if (anchor)
    return (<div>

              <ButtonGroup>
                <Button intent="primary" minimal disabled={anchor && anchor.anchorId !== null ? false : true} onClick={(e) => setNewLinkModal(true)}> Create Link </Button>
                {links.length > 0 && <Button intent="danger" minimal disabled={link ? false : true} onClick={(e) => deleteLink(link.linkId)}> Delete Link </Button>}
              </ButtonGroup>

              <Divider />

              {isLoading ? <Spinner /> : <LinkView
                getNode={getNode}
                getAnchor={getAnchor} 
                links={links} 
                link={link} 
                setLink={setLink}
                getNodeLink={nodeId => `/nodes/${nodeId}`}
                getAnchorLink={(nodeId: string, anchorId: string) => `/nodes/${nodeId}/anchor/${anchorId}`} 
              />}

              <AddLinkModalContainer
                isOpen={newLinkModal}
                setIsOpen={setNewLinkModal}
                anchor={anchor}
              />
          </div>
    )
  else return null
}

export default LinkContainer;
