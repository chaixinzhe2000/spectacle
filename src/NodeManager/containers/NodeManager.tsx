import React, { useState, useEffect, ReactNode } from 'react';
import FileSystem from '../components/FileSystem'
import { ITreeNode, Divider, Button, ButtonGroup } from '@blueprintjs/core';
import NewNodeModal from '../components/modals/NewNodeModal';
import MoveNodeModal from '../components/modals/MoveNodeModal';
import { INode, IFilePath, newFilePath, ALL_NODE_TYPES, NodeType, IServiceResponse, ROOT_ID } from 'spectacle-interfaces'
import FileLocation from '../components/FileLocation';
import RenameNodeModal from '../components/modals/RenameNodeModal';
import { createTreeNodes, setNodeExpand } from '../helpers/treeNodeHelpers';
import { generateNodeId } from '../helpers/generateNodeId';
import NodeTriageComponent from './NodeTriageContainer';
import { Icon } from 'semantic-ui-react';
import { queryCache } from 'react-query';

interface NodeManagerProps {
	selectedNode: INode
	loading: boolean
	rootNode: INode
	anchorId: string
	onDeleteNode: (node: INode) => void
	onNodeClick: (node: INode) => void
	onNodeDoubleClick: (id: string) => void
	onCreateNode: (newNode: INode) => void
	onMoveNode: (fromLocaiton: IFilePath, toLocation: IFilePath) => void
	onUpdateNode: (newNode: INode) => void
	getNode: (nid: string) => IServiceResponse<INode>
}

function NodeManager(props: NodeManagerProps) {
	const { rootNode, selectedNode, onNodeClick, onCreateNode, onDeleteNode, onMoveNode, onUpdateNode, onNodeDoubleClick, getNode, anchorId } = props
	const [newNodeModal, setNewNodeModal]: [boolean, any] = useState(false)
	const [moveNodeModal, setMoveNodeModal]: [boolean, any] = useState(false)
	const [renameModal, setRenameModal]: [boolean, any] = useState(false)
	const [contextNode, setContextNode]: [INode, any] = useState(null)
	const [treeNodes, setTreeNodes]: [ITreeNode<INode>[], any] = useState([])

	// when root node or selected node changes, update tree nodes
	useEffect(() => {
		setTreeNodes(createTreeNodes(rootNode, selectedNode?.nodeId, rootNode?.nodeId === '/'))
	}, [rootNode, selectedNode])

	return (
		<div className="MegaContainer">
			<div className="NodeTree" style={{ margin: '0', width: '100%', padding: '10px', border: '1px solid lightgrey' }}>
				<div className="yellowBox">
					<ButtonGroup minimal={true} >
						{/* Add New Node */}
						<Button icon="add" intent="primary" text="Add New" onClick={() => setNewNodeModal(true)} />

						<Divider />

						{/* File Location */}
						<div style={{ marginTop: "4.5px", marginLeft: "6px" }}>
							<FileLocation filePath={rootNode?.filePath} onClick={onNodeDoubleClick} appendRoot getNode={getNode} />
						</div>

					</ButtonGroup>
				</div>
				{/* File Tree */}
				<Divider />

				<FileSystem
					nodes={treeNodes}
					contextMenu
					onNodeDoubleClick={(node: ITreeNode<INode>) => onNodeDoubleClick(node.id.toString())}
					onNodeClick={(node: ITreeNode<INode>) => onNodeClick(node.nodeData)}
					onDelete={(node: INode) => onDeleteNode(node)}
					onRename={(node: INode) => {
						setContextNode(node)
						setRenameModal(true)
						queryCache.invalidateQueries([node.nodeId, 'node-title'])
					}}
					onMove={(node: INode) => {
						setContextNode(node)
						setMoveNodeModal(true)
					}}
					setNodeExpand={(node: ITreeNode<INode>, nodePath: number[], expanded: boolean) => {
						setTreeNodes(setNodeExpand(treeNodes, node, nodePath, expanded))
					}}
				/>
			</div>

			{/* NodeTriage */}
			<NodeTriageComponent node={selectedNode} anchorId={anchorId} />

			{/* Modals */}
			<NewNodeModal
				node={rootNode}
				isOpen={newNodeModal}
				onClose={() => setNewNodeModal(false)}
				getNode={getNode}
				nodeTypes={ALL_NODE_TYPES}
				onCreate={(name: string, nodeType: NodeType, locationNode: INode) => {
					setNewNodeModal(false)
					const nodeId = generateNodeId()
					const newFp = newFilePath(locationNode.filePath.filePath.filter(val => val !== ROOT_ID).concat(nodeId))
					let node: INode = {
						nodeId: nodeId,
						label: name,
						nodeType: nodeType,
						filePath: newFp,
						children: []
					}
					onCreateNode(node)
				}} />

			<MoveNodeModal
				node={rootNode}
				isOpen={moveNodeModal}
				onClose={() => setMoveNodeModal(false)}
				getNode={getNode}
				nodeToMove={contextNode}
				onMove={async (toLocation: IFilePath) => {
					onMoveNode(contextNode.filePath, toLocation)
					setMoveNodeModal(false)
				}} />

			<RenameNodeModal
				nodeToRename={contextNode}
				isOpen={renameModal}
				onClose={() => setRenameModal(false)}
				onRename={async (newNode: INode) => {
					onUpdateNode(newNode)
					setRenameModal(false)
				}} />
		</div>
	);
}


export default NodeManager;
