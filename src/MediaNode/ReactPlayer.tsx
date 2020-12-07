import ReactPlayer from 'react-player'
import { Component } from "react"
import React from 'react'

class Player extends Component {
	player: React.RefObject<unknown>;
	constructor(props) {
		super(props);
		this.player = React.createRef();
	}
	state = {
		duration: null,
		secondsElapsed: null
	}
	onDuration = (duration) => {
		this.setState({ duration })
	}
	onProgress = (progress) => {
		if (!this.state.duration) {
			// Sadly we don't have the duration yet so we can't do anything
			return
		}

		// progress.played is the fraction of the video that has been played
		// so multiply with duration to get number of seconds elapsed
		const secondsElapsed = progress.played * this.state.duration

		if (secondsElapsed !== this.state.secondsElapsed) {
			this.setState({ secondsElapsed })
		}
	}
	render() {
		return (
			<ReactPlayer
				url='http://example.com/file.mp4'
				onDuration={this.onDuration}
				onProgress={this.onProgress}
			/>
		)
	}
}

export default Player