import ReactPlayer from 'react-player'
import { RouteProps } from 'react-router';
import React from 'react'
import { Component } from 'react'
import Duration from './Duration'

interface PlayerWrapperProps {
    url: string;
  }

class PlayerWrapperClass extends Component<PlayerWrapperProps> {
    player: any;
    ref = player => {
        this.player = player
    }

    render() {
		return (
            <div className='player-wrapper'>
                <ReactPlayer
                    className='react-player'
                    ref={this.ref}
                    url={this.props.url}
                    width='100%'
                    height='100%'
                />
            </div>
		)
	}
}

export default PlayerWrapperClass