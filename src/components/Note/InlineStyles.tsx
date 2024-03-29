import { EditorState } from 'draft-js'
import { Dispatch, SetStateAction } from 'react'
import InlineStyle from './InlineStyle'
import { ToggleButtonGroup } from '@mui/material'

interface InlineStylesProps {
  editorState: EditorState
  setEditorState: Dispatch<SetStateAction<EditorState>>
}

const InlineStyles = ({ editorState, setEditorState }: InlineStylesProps) => (
  <ToggleButtonGroup value={editorState.getCurrentInlineStyle().toArray()}>
    <InlineStyle
      type='BOLD'
      editorState={editorState}
      setEditorState={setEditorState}
    />
    <InlineStyle
      type='ITALIC'
      editorState={editorState}
      setEditorState={setEditorState}
    />
    <InlineStyle
      type='UNDERLINE'
      editorState={editorState}
      setEditorState={setEditorState}
    />
    <InlineStyle
      type='STRIKETHROUGH'
      editorState={editorState}
      setEditorState={setEditorState}
    />
    <InlineStyle
      type='CODE'
      editorState={editorState}
      setEditorState={setEditorState}
    />
  </ToggleButtonGroup>
)

export default InlineStyles
