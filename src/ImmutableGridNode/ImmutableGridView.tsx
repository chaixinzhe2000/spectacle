import { NonIdealState } from '@blueprintjs/core';
import { IImmutableGridAnchor, IImmutableGridNode } from 'spectacle-interfaces';
import React, { useRef, useState } from 'react';
import NewImmutableGridNode from './NewImmutableGridNode';
import { Cell, Column, Table } from "@blueprintjs/table";

interface ImmutableGridViewProps {
    node: IImmutableGridNode
    onAdd: (columns: { key: string, name: string }[], rows: {[columnKey: string]: string}[]) => void
    setNewAnchor: (anc: IImmutableGridAnchor) => void
    newAnchor: IImmutableGridAnchor
    previewAnchor: IImmutableGridAnchor
    anchors: IImmutableGridAnchor[]
}

export default function ImmutableGridView(props: ImmutableGridViewProps) {

    const { node, onAdd, setNewAnchor, newAnchor, previewAnchor, anchors} = props
    const cellRenderer = (rowIndex: number, colIndex: number) => {
        return <Cell>{`(${colIndex},${rowIndex})`}</Cell>
    };

    const selectedRegions = previewAnchor ? [previewAnchor] : newAnchor ? [newAnchor] : anchors

    if (node) {
        return (
            <div>
            <Table 
                numRows={node.rows.length}
                selectedRegions={selectedRegions.map(anc => {
                    return {
                        rows: [anc.topLeftCell.row, anc.bottomRightCell.row],
                        cols: [anc.topLeftCell.columm, anc.bottomRightCell.columm]
                    }
                })}
                enableMultipleSelection
                onSelection={regions => {
                    const anchor: IImmutableGridAnchor = {
                        anchorId: null,
                        topLeftCell: {
                            row: regions[0].rows[0],
                            columm: regions[0].cols[0]
                        },
                        bottomRightCell: {
                            row: regions[0].rows[1],
                            columm: regions[0].cols[1]
                        }
                    }

                    setNewAnchor(anchor)
                }}>
                {[...Array(node.columns.length)].map((val, i) => <Column key={i} name={i.toString()} cellRenderer={cellRenderer}/>)}
            </Table>
            </div>
        );
    } else {
        return <NonIdealState 
        icon="document"
        title="No Immutable Grod Node found."
        description={"You can still add one..."}
        action={<NewImmutableGridNode onAdd={onAdd} />}/>
    }
}