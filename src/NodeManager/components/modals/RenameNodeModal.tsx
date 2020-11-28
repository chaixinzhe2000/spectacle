import React, { useState } from 'react';
import { Dialog, Classes, Button, Colors, InputGroup } from '@blueprintjs/core';
import { INode } from 'hypertext-interfaces'

interface MoveNodeModalProps {
  isOpen: boolean
  onClose: () => void
  onRename: (newDoc: INode) => void
  nodeToRename: INode
}

export default function RenameNodeModal(props: MoveNodeModalProps) {

  const { isOpen, nodeToRename, onClose, onRename } = props
  const [error, setError]: [string, any] = useState('')
  const [name, setName]: [string, any] = useState('')


  const onSubmit = () => {
    if (name === '') {
      setError('Please enter a new name.')
    } else {
      let newDoc = { ...nodeToRename }
      newDoc.label = name
      onRename(newDoc);
      setError('')
      setName('')
    }  
  }

  return (<Dialog
    icon='edit'
    onClose={onClose}
    title="Rename Node"
    isOpen={isOpen}>
    <div className={Classes.DIALOG_BODY}>
    <InputGroup
        large={true}
        value={nodeToRename?.label}
        disabled
      />
      <hr />
      <InputGroup
        large={true}
        placeholder="New Node Name"
        value={name}
        onChange={(e: any) => setName(e.target.value)}
      />
    </div>
    <div className={Classes.DIALOG_FOOTER}>
      <div style={{ color: Colors.RED3 }}>{error}</div>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button onClick={() => onSubmit()} intent="primary"> Rename </Button>
      </div>
    </div>
</Dialog>)
}