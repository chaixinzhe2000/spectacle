

import { H5 } from '@blueprintjs/core';
import { failureServiceResponse, IAnchor, ILink, INode, IServiceResponse } from 'hypertext-interfaces';
import React, { useState } from 'react';
import { Collapse } from 'antd';
import { Accordion, Icon } from 'semantic-ui-react'
import LinkView from '../Links/LinkView';
import LinkContainer from '../Links/LinkContainer';

const { Panel } = Collapse;

interface AnchorViewProps {
    anchors: IAnchor[]
    getNode: (nodeId: string) => IServiceResponse<INode>
    anchor?: IAnchor
    setAnchor: (anchor: IAnchor) => void
    setPreviewAnchor: (anchor: IAnchor) => void
    linkMap: {[anchorId: string] : ILink[]}
    canManageLinks: boolean
}

function AnchorView(props: AnchorViewProps): JSX.Element {
    const { anchors, anchor, setAnchor, getNode, setPreviewAnchor, linkMap, canManageLinks } = props
    
    const activeIndex = anchor ? anchors.findIndex(anc => anc.anchorId === anchor.anchorId) : -1

    if (anchors.length)
        return (
            <Accordion onMouseLeave={() => setPreviewAnchor(null)} styled fluid>
                {anchors.map((a, index) => <div key={a.anchorId}>
                        <Accordion.Title
                            active={activeIndex === index}
                            index={index}
                            onClick={e => setAnchor(a)}
                            onMouseEnter={() => setPreviewAnchor(a)}
                        >
                        <Icon name='dropdown' />
                        {a.label} ({linkMap[a.anchorId] ? linkMap[a.anchorId].length : 0} {linkMap[a.anchorId] ? linkMap[a.anchorId].length === 1 ? 'Link' : 'Links' : 'Links' })
                    </Accordion.Title>
                    {
                        canManageLinks && <Accordion.Content active={activeIndex === index}>
                            <LinkContainer anchor={a} />
                        </Accordion.Content>
                    }
                    </div>
                )}
        </Accordion>
    )
    else
        return null
}

export default AnchorView;


