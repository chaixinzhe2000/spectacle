import React, { useState } from 'react';
import { Dialog, Classes, Button, Colors } from '@blueprintjs/core';
import SelectFileLocation from '../SelectFileLocation';
import { INode, IFilePath, newFilePath, IServiceResponse } from 'spectacle-interfaces'
import { createTreeNodes } from '../../helpers/treeNodeHelpers';

interface MoveNodeModalProps {
  isOpen: boolean
  onClose: () => void
  onMove: (toLocation: IFilePath) => void
  node: INode
  nodeToMove: INode
  getNode: (nid: string) => IServiceResponse<INode>
}

export default function MoveNodeModal(props: MoveNodeModalProps) {

  const { isOpen, node, onClose, onMove, nodeToMove } = props
  const [locationDoc, setLocationDoc]: [INode, any] = useState(null)
  const [error, setError]: [string, any] = useState('')
  const treeNodes = createTreeNodes(node, locationDoc?.nodeId)

  const onSubmit = () => {
    if (locationDoc === null) {
      setError('Please select a location')
    } else if (locationDoc.filePath.filePath === nodeToMove.filePath.parent) {
      setError('Cannot move node to current location.')
    } else if (locationDoc.nodeId === nodeToMove.nodeId) { 
      setError("Cannot move node to be a child of itself.")
    } else {
      onMove(newFilePath(locationDoc.filePath.filePath.concat(nodeToMove.nodeId)));
      setError('')
    }
  }

  return (<Dialog
    icon="move"
    onClose={onClose}
    title="Move Node"
    isOpen={isOpen}>
    <div className={Classes.DIALOG_BODY}>
      {nodeToMove && <h3 className="bp3-heading"> Moving Node: {nodeToMove.label}</h3>}
      <br />
      <SelectFileLocation
        treeNodes={treeNodes}
        getNode={props.getNode}
        onSelectLocation={(node: INode) => setLocationDoc(node)} />
    </div>
    <div className={Classes.DIALOG_FOOTER}>
      <div style={{ color: Colors.RED3 }}>{error}</div>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button onClick={() => onSubmit()} intent="primary"> Move </Button>
      </div>
    </div>
</Dialog>)
}