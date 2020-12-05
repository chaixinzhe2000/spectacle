import React from 'react'
import { render } from 'react-dom';
import ReactPlayer from 'react-player'
 
// Render a YouTube video player

  export default class ReactPlayerWrapper extends React.Component {
    render(){
      return (
        <div><ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' />
		</div>
      );
    }
}