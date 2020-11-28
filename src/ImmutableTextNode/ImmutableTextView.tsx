import React, { useEffect, useState } from 'react';
import Highlightable from 'highlightable'
import { Button, Divider, NonIdealState, TextArea } from '@blueprintjs/core';
import { IImmutableTextAnchor, IImmutableTextNode } from 'hypertext-interfaces';

interface NodeProps {
  node: IImmutableTextNode
  anchor: IImmutableTextAnchor
  previewAnchor: IImmutableTextAnchor
  setAnchor: (anchor: IImmutableTextAnchor) => void
  addNode: (text: string) => void
  anchors: IImmutableTextAnchor[]
  selectedAnchorId: string
}

function ImmutableTextView(props: NodeProps): JSX.Element {
  const { node, anchor, anchors, setAnchor, addNode, previewAnchor, selectedAnchorId } = props
  const [text, setText]: [string, any] = useState('')
  const [description, setDescription]: [string, any] = useState('You can still add one...')
  const [highlightedAnchors, setHighlightedAnchors]: [IImmutableTextAnchor[], any] = useState([])

  useEffect(() => {
    async function setAnchors() {
      await setHighlightedAnchors([])
      if (previewAnchor)
        setHighlightedAnchors([previewAnchor])
      else if (anchor)
        setHighlightedAnchors([anchor])
      else {
        const selectedAnchor = anchors.find(anc => anc.anchorId === selectedAnchorId)
        if (selectedAnchor)
          setHighlightedAnchors([selectedAnchor])
        else 
          setHighlightedAnchors(anchors)
      }
    }

    setAnchors()
   
  }, [previewAnchor, anchor, anchors])


  if (node) {
    return (<div> 
    <Highlightable 
      ranges={highlightedAnchors}
      enabled={true}
      onTextHighlighted={r => {
       setAnchor({
          anchorId: null,
          start: r.start,
          end: r.end
        })
    }}
    highlightStyle={{
      backgroundColor: '#ffcc80'
    }}
    text={node.text}/>
  </div>)
  } else {
    return <NonIdealState
      icon="document"
      title="No Immutable Text Node found."
      description={description}
      action={
      <div>
        <TextArea fill={true} onChange={s => setText(s.target.value)} value={text} />
        <Divider />
        <Button onClick={() => {
          if (text) {
            addNode(text)
            setText("")
            setDescription("You can stilll add one...")
          }
          else
            setDescription("Cannot add an empty Immutable Text string.")
        }}> Add Immutable Text + </Button>
      </div>
      }
    />
  } 
}

export default ImmutableTextView