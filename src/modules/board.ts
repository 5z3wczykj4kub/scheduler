import { Board, DropResultLocation, Status } from '@/types/board'
import { Project } from '@/types/project'
import { pipe } from 'fp-ts/lib/function'
import produce from 'immer'
import { curry, equals, join, move, split, tail } from 'ramda'
import { DraggableLocation } from 'react-beautiful-dnd'

const INITIAL_STATUSES: Status[] = [
  {
    title: 'todo',
    issues: [
      {
        title: 'Adjust column titles',
        content:
          'To rename a status, simply click on the three dots icon next to the status title. This will open the configuration menu, where you can find the option to rename it.',
      },
      {
        title: 'Create your own issues',
        content:
          'Click on the floating action button in the bottom-right corner of the screen to add more issues',
      },
      {
        title: 'Get familiar with the kanban board',
        content:
          'Get to know the kanban board. Customize statuses and issues to fit your needs.',
      },
    ],
  },
  {
    title: 'on hold',
    issues: [],
  },
  {
    title: 'inprogress',
    issues: [],
  },
  {
    title: 'done',
    issues: [],
  },
]

export const INITIAL_VALUES: Board[] = [
  {
    name: 'unsaved',
    project: 'unsaved',
    selected: true,
    createdAt: new Date().toISOString(),
    statuses: INITIAL_STATUSES,
  },
]

const matchByDraggableLocation = curry(
  ({ droppableId }: DraggableLocation, { title }: Status) =>
    pipe(droppableId, split('-'), tail, join('-'), equals(title))
)

const dragStatus = ({ source, destination }: DropResultLocation) =>
  move(source.index, destination.index)

const dragIssueWithinStatus = ({ source, destination }: DropResultLocation) =>
  produce((statuses: Status[]) => {
    const status = statuses.find(matchByDraggableLocation(source))!
    status.issues = move(source.index, destination.index, status.issues)
  })

const dragIssueBetweenStatuses = ({
  source,
  destination,
}: DropResultLocation) =>
  produce((statuses: Status[]) => {
    const sourceStatus = statuses.find(matchByDraggableLocation(source))!
    const destinationStatus = statuses.find(
      matchByDraggableLocation(destination)
    )!
    const [sourceIssue] = sourceStatus.issues.splice(source.index, 1)
    destinationStatus.issues.splice(destination.index, 0, sourceIssue)
  })

// NOTE: It's used with statuses, not boards
export const drag = ({ source, destination }: DropResultLocation) =>
  source.droppableId === 'board' && destination.droppableId === 'board'
    ? dragStatus({ source, destination })
    : source.droppableId === destination.droppableId
    ? dragIssueWithinStatus({ source, destination })
    : dragIssueBetweenStatuses({ source, destination })

// export const add: BoardsEndomorphism = flow(
//   map(set(lensProp('selected'), false)),
//   concat(__, INITIAL_VALUES)
// )
export const add = (project: Project) =>
  produce((boards: Board[]) => {
    boards.forEach((board) => {
      if (board.project === project.name) board.selected = false
    })
    boards.push({ ...INITIAL_VALUES[0], project: project.name })
  })

// export const remove = (name: string): BoardsEndomorphism =>
//   flow(
//     filter(flow(prop('name'), complement(equals(name)))),
//     unless(any(prop('selected')), (boards: any[]) =>
//       pipe(
//         boards,
//         slice(0, -1) as (x: any[]) => any[],
//         concat(__, [set(lensProp('selected'), true, last(boards))])
//       )
//     )
//   )

// TODO: Make such functions polymorphic across all modules
export const remove = (project: Project, name: string) =>
  produce((boards: Board[]) => {
    const boardIndex = boards.findIndex(
      (board) => board.project === project.name && board.name === name
    )
    const [removedBoard] = boards.splice(boardIndex, 1)
    if (removedBoard.selected) {
      const projectBoards = boards.filter(
        (board) => board.project === project.name
      )
      projectBoards[projectBoards.length - 1].selected = true
    }
  })

// export const save = (name: string): BoardsEndomorphism =>
//   map(when(prop('selected'), set(lensProp('name'), name)))
export const save = (project: Project) => (name: string) =>
  produce((boards: Board[]) => {
    boards.forEach((board) => {
      if (board.project === project.name && board.selected) board.name = name
    })
  })

// export const select = (name: string): BoardsEndomorphism =>
//   map(
//     flow(
//       set(lensProp('selected'), false),
//       when(flow(prop('name'), equals(name)), set(lensProp('selected'), true))
//     )
//   )
export const select = (project: Project, name: string) =>
  produce((boards: Board[]) => {
    boards.forEach((board) => {
      if (board.project === project.name) board.selected = board.name === name
    })
  })
