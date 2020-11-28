

import { H5 } from '@blueprintjs/core';
import { IAnchor, ILink, INode, IServiceResponse } from 'hypertext-interfaces';
import React from 'react';
import { Link } from 'react-router-dom';

interface LinkViewProps {
    links: ILink[]
    link: ILink
    setLink: (link: ILink) => void
    getNodeLink: (nodeId: string) => string
    getAnchorLink: (nodeId: string, anchorId: string) => string
    getNode: (nid: string) => IServiceResponse<INode>
    getAnchor: (aid: string) => IServiceResponse<IAnchor>
}

function LinkView(props: LinkViewProps): JSX.Element {
    const { link, links, setLink, getNode, getAnchor, getNodeLink, getAnchorLink } = props
    
    return (<>
                {link && `Selected link: ${link.linkId}`}
                {links.length > 0 && <>
                    <table className="bp3-html-table bp3-interactive">
                        <thead>
                            <tr>
                                <th>Link ID</th>
                                <th>Source Node Label (ID)</th>
                                <th>Source Anchor Label (ID)</th>
                                <th>Destination Node Label (ID)</th>
                                <th>Destination Anchor Label (ID)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {links.map(a => {
                                return (<tr onClick={e => setLink(a)} key={a.linkId}>
                                    <td>{a.linkId}</td>
                                    <td><Link to={getNodeLink(a.srcNodeId)}>{getNode(a.srcNodeId).success ? getNode(a.srcNodeId).payload.label : ''} ({a.srcNodeId})</Link></td>
                                    <td><Link to={getAnchorLink(a.srcNodeId, a.srcAnchorId)}>{getAnchor(a.srcAnchorId).success ? getAnchor(a.srcAnchorId).payload.label : ''} ({a.srcAnchorId})</Link></td>
                                    <td><Link to={getNodeLink(a.destNodeId)}>{getNode(a.destNodeId).success ? getNode(a.destNodeId).payload.label : ''} ({a.destNodeId})</Link></td>
                                    <td><Link to={getAnchorLink(a.destNodeId, a.destAnchorId)}>{getAnchor(a.destAnchorId).success ? getAnchor(a.destAnchorId).payload.label : ''} ({a.destAnchorId})</Link></td>
                                </tr>)
                            })}
                        </tbody>
                    </table>
                </>}
            </>
    )
}

export default LinkView;
