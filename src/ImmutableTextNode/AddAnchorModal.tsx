import React, { useState } from 'react';
import { Dialog, Classes, Button, Colors, InputGroup, TextArea, Divider, H4 } from '@blueprintjs/core';
import { IImmutableTextAnchor } from 'hypertext-interfaces';

interface AddAnchorModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (label: string) => void
  anchor: IImmutableTextAnchor,
  text: string
}

export default function AddAnchorModal(props: AddAnchorModalProps) {

  const { isOpen, onClose, onAdd, text } = props
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
    title="Add Immutable Text Anchor"
    isOpen={isOpen}>
    <div className={Classes.DIALOG_BODY}>
        <H4> Selected Text: </H4>
        <TextArea disabled value={text} style={{width: '100%'}} rows={20}/>
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