import React from 'react'
import { render } from 'react-dom';
import ReactPlayer from 'react-player'

// Render a YouTube video player

export default class ReactPlayerWrapper extends React.Component {
	render() {
		return (
			<div>
				<div className="comment-title">Lecture Content</div>
				<div className="wrapper">
					<ReactPlayer url='https://www.youtube.com/watch?v=6KP7tu3JLSM' />
				</div>
				<div className="comment-title" style={{ marginTop: "3rem"}}>Related Nodes</div>
				<div className="comment">Media Node: Andy's Lecture on Hypertext System</div>
				<div className="comment">Essay Submission: Which hypertext system should I use?</div>
				<div className="comment">PDF: new PDF</div>
			</div>
		);
	}
}