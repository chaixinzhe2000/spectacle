import React, { useState } from 'react';
import { Dialog, Classes, Button, Colors, InputGroup, TextArea, Divider, H4 } from '@blueprintjs/core';
import { IImmutableTextAnchor } from 'spectacle-interfaces';

interface AddAnchorModalProps {
	isOpen: boolean
	onClose: () => void
	onAdd: (annotation: string, author: string) => void
	anchor: IImmutableTextAnchor,
	text: string
}

export default function AddAnchorModal(props: AddAnchorModalProps) {

	const { isOpen, onClose, onAdd, text } = props
	const [error, setError]: [string, any] = useState('')
	const [annotation, setAnnotation]: [string, any] = useState('')
	const [author, setAuthor]: [string, any] = useState('')

	const onSubmit = () => {

		if (annotation === '') {
			setError('Please enter a label.')
		} else {
			if (author === "") {
				onAdd(annotation, "Anonymous");
			} else {
				onAdd(annotation, author);
			}
			setError('')
			setAnnotation('')
		}

	}

	return (<Dialog
		icon='edit'
		onClose={onClose}
		title="Add Immutable Text Anchor"
		isOpen={isOpen}>
		<div className={Classes.DIALOG_BODY}>
			<H4> Selected Text: </H4>
			<TextArea disabled value={text} style={{ width: '100%' }} rows={20} />
			<Divider />
			<InputGroup
				large={true}
				placeholder="Author (leave blank to stay anonymous)"
				value={author}
				onChange={(e: any) => setAuthor(e.target.value)} />
			<InputGroup
				large={true}
				placeholder="Anchor Label"
				value={annotation}
				onChange={(e: any) => setAnnotation(e.target.value)} />
		</div>
		<div className={Classes.DIALOG_FOOTER}>
			<div style={{ color: Colors.RED3 }}>{error}</div>
			<div className={Classes.DIALOG_FOOTER_ACTIONS}>
				<Button onClick={() => onSubmit()} intent="primary"> Add Annotation </Button>
			</div>
		</div>
	</Dialog>)
}