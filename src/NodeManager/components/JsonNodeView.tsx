import React from 'react';
import { Link } from 'react-router-dom';
import {INode} from 'spectacle-interfaces'
import ReactJson, { CollapsedFieldProps } from 'react-json-view'
import { Callout } from '@blueprintjs/core';

interface NodeProps {
  node: INode
}

function JsonNodeView(props: NodeProps): JSX.Element {
  const { node } = props
  if (node) {
    return (

		<Callout icon={"box"} title={node.label} intent={"primary"}>
				This field can be used to display a description of the Folder node. It is not supported at the moment, please check back later!
		</Callout>)
	  
	//   <ReactJson name={false} src={node} shouldCollapse={(field: CollapsedFieldProps) => field.name === 'children' || field.name === 'filePath'}/>)
  } else {
    return <div> Couldn't find that resource. Back to <Link to={`/`}> home </Link> </div>
  } 
}

export default JsonNodeView;
