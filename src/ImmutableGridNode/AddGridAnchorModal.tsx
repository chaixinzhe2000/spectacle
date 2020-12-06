import React, { useState } from 'react';
import { Dialog, Classes, Button, Colors, InputGroup, TextArea, Divider, H5 } from '@blueprintjs/core';
import { IImmutableGridAnchor, IImmutableGridNode } from 'spectacle-interfaces';
import PreviewGridAnchor from './PreviewGridAnchor';

interface AddAnchorModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (label: string) => void
  anchor: IImmutableGridAnchor,
  node: IImmutableGridNode
}

export default function AddGridAnchorModal(props: AddAnchorModalProps) {

  const { isOpen, onClose, onAdd, node, anchor } = props
  const [error, setError]: [string, any] = useState('')
  const [label, setLabel]: [string, any] = useState('')


  const onSubmit = () => {
    if (label === '') {
      setError('Please enter a label.')
    } else {
      onAdd(label);
      setError('')
      setLabel('')
    }  
  }

  return (<Dialog
    icon='edit'
    onClose={onClose}
    title="Add Immutable Grid Anchor"
    isOpen={isOpen}>
    <div className={Classes.DIALOG_BODY}>
        <H5> Selected Region: </H5>
        <PreviewGridAnchor node={node} anchor={anchor}/>
        <Divider />
        <InputGroup
            large={true}
            placeholder="Anchor Label"
            value={label}
            onChange={(e: any) => setLabel(e.target.value)}
      />
    </div>
    <div className={Classes.DIALOG_FOOTER}>
      <div style={{ color: Colors.RED3 }}>{error}</div>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button onClick={() => onSubmit()} intent="primary"> Add Anchor </Button>
      </div>
    </div>
</Dialog>)
}