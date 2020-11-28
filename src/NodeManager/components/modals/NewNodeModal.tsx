import React, { useState } from 'react';
import { Dialog, Classes, Button, InputGroup, Divider, Colors } from '@blueprintjs/core';
import SelectFileLocation from '../SelectFileLocation';
import { createTreeNodes } from '../../helpers/treeNodeHelpers';
import { INode, IServiceResponse, NodeType } from 'hypertext-interfaces'

interface NewNodeModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (name: string, type: NodeType, locationDoc: INode) => void
  node: INode
  getNode: (nid: string) => IServiceResponse<INode>
  nodeTypes: NodeType[]
}

export default function NewNodeModal(props: NewNodeModalProps) {

  const [name, setName]: [string, any] = useState('')
  const [nodeType, setNodeType]: [NodeType, any] = useState('node')
  const [locationDoc, setLocationDoc]: [INode, any] = useState(null)
  const [error, setError]: [string, any] = useState('')
  const { isOpen, onClose, node } = props
  const treeNodes = createTreeNodes(node, locationDoc?.nodeId)

  const onCreate = () => {
    if (name === '') {
      setError('Please Name the Node.')
    } else if (locationDoc === null) {
      setError('Please Select a Location')
    } else {
      props.onCreate(name, nodeType, locationDoc);
      setName('')
    }
  }

  return (<Dialog
    icon="add-to-folder"
    onClose={onClose}
    title="New Node"
    isOpen={isOpen}>
    <div className={Classes.DIALOG_BODY}>
      <InputGroup
        large={true}
        placeholder="Node Name"
        value={name}
        onChange={(e: any) => setName(e.target.value)}
      />

      <Divider />
      <div className="bp3-select bp3-fill">
        <select defaultValue={nodeType} onChange={e => setNodeType(e.currentTarget.value)}>
          {props.nodeTypes.map(val => <option key={val} value={val}>{val}</option>)}
        </select>
      </div>
      
      <Divider />
      <SelectFileLocation treeNodes={treeNodes} onSelectLocation={(doc: INode) => setLocationDoc(doc)} getNode={props.getNode} />
    </div>
    <div className={Classes.DIALOG_FOOTER}>
      <div style={{ color: Colors.RED3 }}>{error}</div>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button onClick={() => onCreate()} intent="primary"> Create + </Button>
      </div>
    </div>
</Dialog>)
}