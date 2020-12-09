import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, ButtonGroup, Callout, Divider, H5 } from '@blueprintjs/core';
import AnchorView from './AnchorView';
import { IAnchor, IImmutableTextAnchor, ILink, INode, IServiceResponse, newFilePath, ROOT_ID, successfulServiceResponse } from 'spectacle-interfaces';
import { queryCache, useMutation, useQuery } from 'react-query';
import HypertextSdk from '../HypertextSdk';
import AnchorGateway from '../Gateways/AnchorGateway';
import AddLinkModalContainer from '../Links/AddLinkModalContainer';
import AddFollowUpModal from './AddFollowUpModal';
import UpdateAnnotationModal from './UpdateAnnotationModal';
import { generateAnchorId } from '../NodeManager/helpers/generateNodeId';

interface AnchorContainerProps {
	selectedAnchor: IAnchor
	node: INode
	setSelectedAnchor: (anchor: IAnchor) => void
	setPreviewAnchor: (anchor: IAnchor) => void
	setAnchorIds: (anchorIds: string[]) => void
	clearSelection: () => void
	mediaDuration: number
	setMediaPlayed: any
	mediaPlaying: boolean
	setMediaPlaying: any
	setNewMediaAnchorModal: any
	newImmutableTextAnchorModal: boolean
	setImmutableTextNewAnchorModal: any
	newPDFAnchorModal: boolean
    setNewPDFAnchorModal: any
	newImmutableTextAnchor: IImmutableTextAnchor
	setNewImmutableTextAnchor: any
	newLinkModalIsOpen: boolean
	setNewLinkModalIsOpen: any
	setPreviouslyPaused: any
	setMediaSkipUsingAnnotation: any
	
}

function AnchorContainer(props: AnchorContainerProps): JSX.Element {
	const { node, selectedAnchor, setSelectedAnchor, setPreviewAnchor, clearSelection,
		setAnchorIds, mediaDuration, setMediaPlayed, mediaPlaying, setMediaPlaying, setNewMediaAnchorModal,
		newImmutableTextAnchorModal, setImmutableTextNewAnchorModal, newImmutableTextAnchor, setNewImmutableTextAnchor, newLinkModalIsOpen, 
		setNewLinkModalIsOpen, setPreviouslyPaused, setMediaSkipUsingAnnotation, newPDFAnchorModal, setNewPDFAnchorModal } = props

	const [newFollowUpModal, setNewFollowUpModal]: [boolean, any] = useState(false)
	const [newUpdateAnnotationModal, setNewUpdateAnnotationModal]: [boolean, any] = useState(false)
	const [newGenericAnchorModal, setNewGenericAnchorModal]: [boolean, any] = useState(false)


	// Get Node Anchors, On Success Cache Anchors by Anchor ID
	const anchorMap = useQuery([node.nodeId, 'anchors'], AnchorGateway.getNodeAnchors, {
		onSuccess: (data) => {
			if (data.success) {
				if (Object.keys(data.payload).length !== anchorIds.length) {
					const anchors = data.payload
					setAnchorIds(Object.keys(anchors))
					Object.keys(anchors).forEach(aid => queryCache.setQueryData(aid, successfulServiceResponse(anchors[aid])))
				}
			}
		},
		enabled: node
	}).data?.payload

	const anchorIds = anchorMap ? Object.keys(anchorMap) : []

	const [deleteAnchor] = useMutation(HypertextSdk.deleteAnchor, {
		onSuccess: () => {
            queryCache.invalidateQueries([node.nodeId, 'anchors']);
			queryCache.invalidateQueries([anchorIds, 'generic-anchors']);
			queryCache.invalidateQueries([anchorIds, 'media-anchors']);
            queryCache.invalidateQueries([anchorIds, 'immutable-text-anchors'])
		}
	})

	const [updateLastAnnotation] = useMutation(HypertextSdk.updateLastAnnotation, {
		onSuccess: () => {
			queryCache.invalidateQueries([node.nodeId, 'anchors']);
			queryCache.invalidateQueries([anchorIds, 'generic-anchors']);
			queryCache.invalidateQueries([anchorIds, 'media-anchors']);
            queryCache.invalidateQueries([anchorIds, 'immutable-text-anchors'])
		}
	})

	const [createFollowUp] = useMutation(HypertextSdk.addAnchorFollowUp, {
		onSuccess: () => {
			queryCache.invalidateQueries([node.nodeId, 'anchors']);
			queryCache.invalidateQueries([anchorIds, 'generic-anchors']);
			queryCache.invalidateQueries([anchorIds, 'media-anchors']);
            queryCache.invalidateQueries([anchorIds, 'immutable-text-anchors'])
		}
	})

	const [createGenericAnchor] = useMutation(AnchorGateway.createAnchor, {
		onSuccess: () => {
			queryCache.invalidateQueries([node.nodeId, 'anchors']);
			queryCache.invalidateQueries([anchorIds, 'generic-anchors']);
			queryCache.invalidateQueries([anchorIds, 'media-anchors']);
			queryCache.invalidateQueries([anchorIds, 'immutable-text-anchors'])
		}
	})

	return (
		<div style={{ margin: '0', width: '100%', padding: '10px', border: '1px solid lightgrey' }}>
			<Callout className="nodeTitle" icon={"book"} title={"Annotations"} intent={"success"}></Callout>
			<Divider />
			{<div>
				<Button intent="primary" icon="add-to-artifact" minimal
					disabled={((node.nodeType === 'immutable-text' && newImmutableTextAnchor) || node.nodeType === 'media' || node.nodeType === "PDF") ? false : true}
					onClick={(e) => {
						if (node.nodeType === 'media') {
							setNewMediaAnchorModal(true)
							if (mediaPlaying) {
								setPreviouslyPaused(false)
							} else {
								setPreviouslyPaused(true)
							}
							setMediaPlaying(false)
						} else if (node.nodeType === 'immutable-text') {
							setImmutableTextNewAnchorModal(true)
						} else if (node.nodeType === 'PDF') {
							setNewPDFAnchorModal(true)
						}
					}}> Add New </Button>
				<Button intent="warning" icon="paperclip" minimal disabled={selectedAnchor ? false : true} onClick={(e) => {
					setNewFollowUpModal(true)
					setMediaPlaying(false)
				}}> Follow Up </Button>
				<Button intent="success" icon="new-link" minimal disabled={selectedAnchor ? false : true} onClick={(e) => {
					setNewLinkModalIsOpen(true)
					setMediaPlaying(false)
				}}> Link </Button>

				<Divider />
				
				<Button intent="success" icon="updated" minimal disabled={selectedAnchor ? false : true} onClick={(e) => {
					setNewUpdateAnnotationModal(true)
					setMediaPlaying(false)
				}}> Edit </Button>
				<Button intent="none" icon="clean" minimal disabled={(newImmutableTextAnchor || selectedAnchor) ? false : true} onClick={(e) => {
					if (node.nodeType === 'immutable-text') {
						setNewImmutableTextAnchor(null)
					}
					clearSelection()
				}}> Clear Selection </Button>
				<Button intent="danger" icon="graph-remove" minimal disabled={selectedAnchor ? false : true} onClick={(e) => {
					deleteAnchor(selectedAnchor.anchorId)
					setSelectedAnchor(null)
				}}> Delete </Button>
				<Divider />
			</div>
			}

			<AnchorView
				anchor={selectedAnchor}
				anchorIds={anchorIds}
				node={node}
				setAnchor={anc => setSelectedAnchor(anc)}
				setMediaPlayed={setMediaPlayed}
				mediaDuration={mediaDuration}
				mediaPlaying={mediaPlaying}
				setMediaPlaying={setMediaPlaying}
				setMediaSkipUsingAnnotation={setMediaSkipUsingAnnotation}
			/>

			<AddFollowUpModal
				isOpen={newFollowUpModal}
				onClose={() => setNewFollowUpModal(false)}
				onUpdate={(anchorId, content, author) => {
					createFollowUp({ anchorId, content, author })
					setNewFollowUpModal(false)
				}}
				anchor={selectedAnchor}
			/>

			<UpdateAnnotationModal
				isOpen={newUpdateAnnotationModal}
				onClose={() => setNewUpdateAnnotationModal(false)}
				onUpdate={(anchorId, content, author) => {
					updateLastAnnotation({ anchorId, content, author })
					setNewUpdateAnnotationModal(false)
				}}
				anchor={selectedAnchor}
			/>

			<AddLinkModalContainer
                node={node}
				isOpen={newLinkModalIsOpen}
				setIsOpen={setNewLinkModalIsOpen}
				anchor={selectedAnchor}
			/>

			
		</div>)

}

export default AnchorContainer;
