import DraggableDialog, {
  DraggableDialogProps,
} from '@/layout/DraggableDialog/DraggableDialog'
import { Issue } from '@/types/issue'
import { Button, Typography } from '@mui/material'
import { MouseEventHandler } from 'react'

interface DeleteIssueDialogProps extends DraggableDialogProps {
  issue: Issue
  onDelete: (issue: Issue) => void
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

const DeleteIssueDialog = ({
  issue,
  onDelete,
  onClose,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: DeleteIssueDialogProps) => (
  <DraggableDialog
    {...props}
    onClose={onClose}
    dialogTitle='Delete issue'
    dialogContent={
      <Typography>Are you sure you want to delete this issue?</Typography>
    }
    dialogActions={
      <>
        <Button variant='outlined' onClick={onCancel}>
          Cancel
        </Button>
        <Button variant='outlined' onClick={() => onDelete(issue)}>
          Delete
        </Button>
      </>
    }
  />
)

export default DeleteIssueDialog
