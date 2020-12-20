import React, { useState } from 'react';
import { Dialog, Classes, Button, Colors, InputGroup, TextArea, Divider, H4 } from '@blueprintjs/core';
import { IImmutableTextAnchor } from 'spectacle-interfaces';

interface AddAnchorModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (content: string, author: string) => void
}

export default function AddAnchorModal(props: AddAnchorModalProps) {
    const { isOpen, onClose, onAdd } = props

	const [error, setError]: [string, any] = useState('')
	const [content, setContent]: [string, any] = useState('')
	const [author, setAuthor]: [string, any] = useState('')

    const onSubmit = () => {
		if (content === '') {
			setError('Please enter a non-empty annotation.')
		} else {
			if (author == '') {
				onAdd(content, 'Anonymous');
			} else {
				onAdd(content, author);
			}
			setError('')
            setContent('')
		}
	}
    
	return (<Dialog
		icon='edit'
		onClose={onClose}
		title="Add New Annotation"
		isOpen={isOpen}>
		<div className={Classes.DIALOG_BODY}>
			<InputGroup
				large={true}
				placeholder="Author (leave blank to stay ananymous)"
				value={author}
				onChange={(e: any) => setAuthor(e.target.value)}
			/>
			<div className="DialogGap"></div>
			<InputGroup
				large={true}
				placeholder="Annotation"
				value={content}
                onChange={(e: any) => setContent(e.target.value)}
                autoFocus
			/>
		</div>
		<div className={Classes.DIALOG_FOOTER}>
			<div style={{ color: Colors.RED3 }}>{error}</div>
			<div className={Classes.DIALOG_FOOTER_ACTIONS}>
				<Button onClick={() => {onSubmit()}} intent="primary"> Add Annotation </Button>
			</div>
		</div>
	</Dialog>)
}