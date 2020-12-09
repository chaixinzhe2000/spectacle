import React, { useState } from 'react';
import { Dialog, Classes, Button, Colors, InputGroup, TextArea, Divider, H4 } from '@blueprintjs/core';
import { IAnchor, IImmutableTextAnchor, IMediaAnchor } from 'spectacle-interfaces';
import { time } from 'console';


interface UpdateAnnotationModalProps {
	isOpen: boolean
	onClose: () => void
	onUpdate: (anchorId: string, content: string, author: string) => void
	anchor: IAnchor
}

export default function UpdateAnnotationModal(props: UpdateAnnotationModalProps) {

	const { isOpen, onClose, onUpdate, anchor } = props
	const [error, setError]: [string, any] = useState('')
	const [content, setContent]: [string, any] = useState('')
	const [author, setAuthor]: [string, any] = useState('')

	const onSubmit = () => {
		if (content === '') {
			setError('Please enter a non-empty annotation.')
		} else {
			if (author == '') {
				onUpdate(anchor.anchorId, content, 'Anonymous');
			} else {
				onUpdate(anchor.anchorId, content, author);
			}
			setError('')
			setContent('')
		}
	}

	// TODO: change dialog to something that's only on the right column
	return (<Dialog
		icon='annotation'
		onClose={onClose}
		title="Add Follow Up"
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
				<Button onClick={() => onSubmit()} intent="primary"> Add Follow Up </Button>
			</div>
		</div>
	</Dialog>)
}