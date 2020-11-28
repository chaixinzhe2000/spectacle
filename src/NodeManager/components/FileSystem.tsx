import * as React from "react";
import { Classes, Menu, MenuItem, ITreeNode, Tree } from "@blueprintjs/core";
import {ContextMenuTarget} from '@blueprintjs/core/lib/esnext/components/context-menu/contextMenuTarget.js';
import { INode } from 'hypertext-interfaces'

interface FileExplorerProps {
    onNodeClick: (node: ITreeNode<INode>, nodePath: number[]) => void
    onNodeDoubleClick: (node: ITreeNode<INode>) => void
    onDelete?: (node: INode) => void
    onMove?: (doc: INode) => void
    onRename?: (doc: INode) => void
    nodes: ITreeNode<INode>[]
    contextMenu: boolean
    setNodeExpand: (node: ITreeNode<INode>, nodePath: number[], expanded: boolean) => void
}

interface FileExplorerState {
    nodes: ITreeNode<INode>[]
    node: ITreeNode<INode>
}

// use Component so it re-renders everytime: `nodes` are not a primitive type
// and therefore aren't included in shallow prop comparison
@ContextMenuTarget
class FileExplorerWithContext extends React.Component<FileExplorerProps, FileExplorerState> {

    public render() {
        return (
            <div className="docs-context-menu-example" >
                {/* {this.props.contextMenu ? <GraphNode /> : null} */}
                <Tree
                    contents={this.props.nodes}
                    onNodeContextMenu={(node: ITreeNode<INode>, nodePath: number[]) => {
                        this.setState({ node: node })
                    }}
                    onNodeClick={(node: ITreeNode<INode>, nodePath, e) => {
                        this.props.onNodeClick(node, nodePath)
                        // this.handleNodeClick(node, nodePath, e)
                    }}
                    onNodeExpand={(node: ITreeNode<INode>, nodePath: number[]) => this.props.setNodeExpand(node, nodePath, true)}
                    onNodeCollapse={(node: ITreeNode<INode>, nodePath: number[]) => this.props.setNodeExpand(node, nodePath, false)}
                    className={Classes.ELEVATION_0}
                    onNodeDoubleClick={(node: ITreeNode<INode>) => this.props.onNodeDoubleClick(node)}
                />
            </div>
        );
    }

    public renderContextMenu(e: React.MouseEvent<HTMLElement>) {
    
    return (
        <Menu>
            <MenuItem icon="edit" text="Rename" onClick={() => this.props.onRename(this.state.node.nodeData)}/>
            <MenuItem icon="delete" text="Delete" onClick={() => this.props.onDelete(this.state.node.nodeData)} />
            <MenuItem icon="move" text="Move" onClick={() => this.props.onMove(this.state.node.nodeData)}/>
        </Menu>
    );
    }
}

function FileExplorerWithoutContext(props: FileExplorerProps): JSX.Element {
    return (
        <Tree
            contents={props.nodes}
            onNodeClick={(node: ITreeNode<INode>, nodePath) => props.onNodeClick(node, nodePath)}
            onNodeExpand={(node: ITreeNode<INode>, nodePath: number[]) => props.setNodeExpand(node, nodePath, true)}
            onNodeCollapse={(node: ITreeNode<INode>, nodePath: number[]) => props.setNodeExpand(node, nodePath, false)}
            className={Classes.ELEVATION_0}
        />
    );
}

export default function FileExplorer(props: FileExplorerProps): JSX.Element {
    if (props.contextMenu) {
        return <FileExplorerWithContext { ...props }/>
    } else {
        return <FileExplorerWithoutContext { ...props } />
    }
} 