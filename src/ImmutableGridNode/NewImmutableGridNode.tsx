import { Button, Icon, InputGroup, IPanel, IPanelProps, NumericInput, PanelStack, Switch } from '@blueprintjs/core';
import React, { useState } from 'react';
import { Cell, Column, Table } from "@blueprintjs/table";

interface NewImmutableGridNodeProps {
    onAdd: (columns: { key: string, name: string }[], rows: {[columnKey: string]: string}[]) => void
}

export default function NewImmutableGridNode(props: NewImmutableGridNodeProps) {

    const { onAdd } = props
    const [numColumns, setNumColumns]: [number, any] = useState(1)
    const [numRows, setNumRows]: [number, any] = useState(10)
    
    const cellRenderer = (rowIndex: number, colIndex: number) => {
        return <Cell>{`(${colIndex},${rowIndex})`}</Cell>
    };

    return (<>
        Columns:
        <NumericInput value={numColumns} onValueChange={num => setNumColumns(num)} min={1} max={100}/>

        Rows:
        <NumericInput value={numRows} onValueChange={num => setNumRows(num)}  min={1} max={100}/>

        <Button text="Add Immutable Grid" icon='add' intent='primary' onClick={e => {
            const columns: { key: string, name: string }[] = [...Array(numColumns)].map((val, i) => {
                return {
                    key: i.toString(),
                    name: i.toString()
                }
            })

            const rows: {[columnKey: string]: string}[] = [...Array(numRows)].map((val, row) => {
                let newRow = {}
                for (let col = 0; col < numColumns; col++) {
                    newRow[col.toString()] =  `(${col}, ${row})`
                }
                return newRow
            })

            onAdd(columns, rows)
        }} />

        <Table numRows={numRows}>
            {[...Array(numColumns)].map((val, i) => <Column key={i} name={i.toString()} cellRenderer={cellRenderer}/>)}
        </Table>
    </>)
}
