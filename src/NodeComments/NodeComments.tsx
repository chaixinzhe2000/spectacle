import React from 'react'
import { render } from 'react-dom';
import ReactPlayer from 'react-player'
 
// Render a YouTube video player

  export default class NodeComments extends React.Component {
    render(){
      return (
        <div>
			<div className="comment-title">Media Comments</div>
			<div className="comment">I really enjoyed this class. Vasey is a great instructor and I felt I learnt a lot this semester.</div>
			<div className="comment">This class was one of the most interesting classes I have taken thus far in university, and the professor was also within my top preferences for professors. I would recommend this class.</div>
			<div className="comment">The only aspect about this class that I would change would be my effort in it because I was not very invested in reading the course material but I know that each material would be very interesting.</div>
			<div className="comment">This course was by far my favourite I've taken to date. Dr. Vasey is extremely knowledgable and has a way of teaching that allows the information to seamlessly make sense. Examination was fair, and Ritchie was always available and willing to talk or spend extra time on a confusing concept.</div>
			<div className="comment">One of the most interesting modules in the year. The lecturer knows how to give lecture.</div>
			<div className="comment">I mostly like the fact that the arguments are explained in detail so that people who are interested in the module can get an important contribution to their knowledge.</div>
		</div>
      );
    }
}