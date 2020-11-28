import { NonIdealState } from '@blueprintjs/core';
import { IImmutableGridAnchor, IImmutableGridNode } from 'hypertext-interfaces';
import React, { useRef, useState } from 'react';
import NewImmutableGridNode from './NewImmutableGridNode';
import { Cell, Column, Table, SelectionModes } from "@blueprintjs/table";

interface ImmutableGridViewProps {
    node: IImmutableGridNode
    anchor: IImmutableGridAnchor
}

export default function PreviewGridAnchor(props: ImmutableGridViewProps) {

    const { node, anchor } = props

    const rows = node.rows.slice(anchor.topLeftCell.row, anchor.bottomRightCell.row + 1)
    const cols = node.columns.slice(anchor.topLeftCell.columm, anchor.bottomRightCell.columm + 1)

    const cellRenderer = (rowIndex: number, key: string) => {
        return <Cell>{rows[rowIndex][key]}</Cell>
    };

    if (node) {
        return (
            <Table numRows={rows.length} selectionModes={SelectionModes.NONE}>
                {cols.map((val, i) => <Column key={i} name={val.name} cellRenderer={(ri, ci) => cellRenderer(ri, val.key)}/>)}
            </Table>
        );
    }

    return null
}