import React from 'react';
import { Link } from 'react-router-dom';
import { INode } from 'spectacle-interfaces'
import ReactJson, { CollapsedFieldProps } from 'react-json-view'
import { Callout } from '@blueprintjs/core';

interface NodeProps {
	node: INode
}

function JsonNodeView(props: NodeProps): JSX.Element {
	const { node } = props
	if (node) {
		return (
			<div className="NodeBox">
				<Callout icon={"inbox"} title={node.label} intent={"primary"}>
					<div className="NodeBoxGap">
						This field can be used to display a description of the Folder node. For example, you can include your syllabus or requirement for assignments here. Below is a list of its sub-nodes and their respective types.
					</div>
					<div className="NodeBoxGap">
						<b>This folder contains the following nodes:</b>
					</div>
					<div className="NodeBoxGap">
					{node.children.map((n, index) =>
									<div key={index}>
										<p><b>{n.label}</b>  ({n.nodeType.charAt(0).toUpperCase() + n.nodeType.substring(1)})</p>
									</div>
								)}
					</div>
				</Callout>
			</div>)

		//   <ReactJson name={false} src={node} shouldCollapse={(field: CollapsedFieldProps) => field.name === 'children' || field.name === 'filePath'}/>)
	} else {
		return <div> Couldn't find that resource. Back to <Link to={`/`}> home </Link> </div>
	}
}

export default JsonNodeView;
