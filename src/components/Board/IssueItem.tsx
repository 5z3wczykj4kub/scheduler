import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { Issue, Status } from '../../types/board'
import IssueActionsMenu from './IssueActionsMenu'

interface IssueItemProps {
  index: number
  issue: Issue
  issues: Issue[]
  statuses: Status[]
  setStatuses: Dispatch<SetStateAction<Status[]>>
}

const IssueItem = ({
  index,
  issue,
  issues,
  statuses,
  setStatuses,
}: IssueItemProps) => (
  <Draggable draggableId={issue.title} index={index}>
    {({ draggableProps, dragHandleProps, innerRef }) => (
      <Card
        {...draggableProps}
        {...dragHandleProps}
        ref={innerRef}
        sx={{
          height: 120,
          cursor: 'grab',
          '&:hover': { bgcolor: (theme) => theme.palette.secondary.main },
          '&:first-of-type': { mt: 0.75 },
        }}
      >
        <CardHeader
          title={issue.title}
          action={
            <IssueActionsMenu
              issue={issue}
              issues={issues}
              statuses={statuses}
              setStatuses={setStatuses}
            />
          }
          titleTypographyProps={{
            variant: 'body1',
            noWrap: true,
          }}
          sx={{
            pb: 0,
            '.MuiCardHeader-content': {
              width: 'calc(100% - 60px)',
            },
          }}
        />
        <CardContent sx={{ pb: '1rem !important' }}>
          <Typography
            sx={{
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {issue.content}
          </Typography>
        </CardContent>
      </Card>
    )}
  </Draggable>
)

export default IssueItem
