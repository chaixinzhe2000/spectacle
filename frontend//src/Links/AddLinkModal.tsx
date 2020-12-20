import React, { useEffect, useState } from 'react';
import { Dialog, Classes, Button, Divider, Colors, H3, Spinner, ButtonGroup } from '@blueprintjs/core';
import { IAnchor, INode, IServiceResponse } from 'spectacle-interfaces'
import AnchorView from '../Anchors/AnchorView';
import { createTreeNodes } from '../NodeManager/helpers/treeNodeHelpers';
import SelectFileLocation from '../NodeManager/components/SelectFileLocation';

interface AddLinkModalProps {
	isOpen: boolean
	onClose: () => void
	onCreate: (destNode: INode) => void
	anchors: IAnchor[]
	selectNode: (node: INode) => void
	node: INode
	anchor: IAnchor
	getNode: (nid: string) => IServiceResponse<INode>
	isLoading: boolean
}

export default function AddLinkModal(props: AddLinkModalProps) {
	// TODO: reimplement
	const { isOpen, onClose, node, selectNode, anchors, getNode, anchor, isLoading } = props

	const [locationAnchor, setLocationAnchor]: [IAnchor, any] = useState(null)
	const [locationNode, setLocationNode]: [INode, any] = useState(null)
	const [error, setError]: [string, any] = useState('')
	const treeNodes = createTreeNodes(node, locationNode?.nodeId)

	// useEffect(() => {
	// 	setLocationAnchor(null)
	// }, [anchors])

	const onCreate = () => {
		if (locationNode === null) {
			setError('Please select a location node')
		} else {
			props.onCreate(locationNode);
			setLocationNode(null)
		}
	}

	return (<Dialog
		icon="add-to-folder"
		onClose={onClose}
		title={
			<ButtonGroup>
				New Link
        <Divider />
				{isLoading && <Spinner size={10} />}
			</ButtonGroup>
		}
		isOpen={isOpen}>
		<div className={Classes.DIALOG_BODY}>
			<H3> Create New Link </H3>
			<SelectFileLocation getNode={getNode} treeNodes={treeNodes} onSelectLocation={(node: INode) => { setLocationNode(node); selectNode(node) }} />
			<Divider />
			{/* <AnchorView canManageLinks={false} anchors={anchors} anchor={locationAnchor} getNode={getNode} setAnchor={setLocationAnchor} setPreviewAnchor={console.log} linkMap={{}} /> */}
		</div>
		<div className={Classes.DIALOG_FOOTER}>
			<div style={{ color: Colors.RED3 }}>{error}</div>
			<div className={Classes.DIALOG_FOOTER_ACTIONS}>
				<Button onClick={() => onCreate()} intent="primary"> Create + </Button>
			</div>
		</div>
	</Dialog>)
}