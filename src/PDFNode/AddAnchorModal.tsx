import React, { useState } from 'react';
import { Dialog, Classes, Button, Colors, InputGroup, TextArea, Divider, H4 } from '@blueprintjs/core';
import { IImmutableTextAnchor, IMediaAnchor } from 'spectacle-interfaces';
import { time } from 'console';


interface AddAnchorModalProps {
	isOpen: boolean
	onClose: () => void
	onAdd: (content: string, author: string, timeStamp: number) => void
	anchor: IMediaAnchor
	newMediaTime: number
}

export default function AddAnchorModal(props: AddAnchorModalProps) {

	const { isOpen, onClose, onAdd, anchor, newMediaTime } = props
	const [error, setError]: [string, any] = useState('')
	const [content, setContent]: [string, any] = useState('')
	const [author, setAuthor]: [string, any] = useState('')

	const onSubmit = () => {
		if (content === '') {
			setError('Please enter a non-empty annotation.')
		} else if (typeof newMediaTime !== "number") {
			setError("Please enter a valid time stamp.")
		} else {
			if (author == '') {
				onAdd(content, 'Anonymous', newMediaTime);
			} else {
				onAdd(content, author, newMediaTime);
			}
			setError('')
			setContent('')
		}
	}

	// TODO: change dialog to something that's only on the right column
	return (<Dialog
		icon='edit'
		onClose={onClose}
		title="Add New Annotation"
		isOpen={isOpen}>
		<div className={Classes.DIALOG_BODY}>
			{/* <H4> Selected Text: </H4>
			<TextArea disabled value={text} style={{ width: '100%' }} rows={20} /> */}
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
				<Button onClick={() => onSubmit()} intent="primary"> Add Annotation </Button>
			</div>
		</div>
	</Dialog>)
}