import React from 'react';
import { Link } from 'react-router-dom';
import {INode} from 'hypertext-interfaces'
import ReactJson, { CollapsedFieldProps } from 'react-json-view'

interface NodeProps {
  node: INode
}

function JsonNodeView(props: NodeProps): JSX.Element {
  const { node } = props
  if (node) {
    return (<ReactJson name={false} src={node} shouldCollapse={(field: CollapsedFieldProps) => field.name === 'children' || field.name === 'filePath'}/>)
  } else {
    return <div> Couldn't find that resource. Back to <Link to={`/`}> home </Link> </div>
  } 
}

export default JsonNodeView;
