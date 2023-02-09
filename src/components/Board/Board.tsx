import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { useLocalStorage } from 'usehooks-ts'
import { STATUSES } from '../../mocks/board'
import { calculateDragState } from '../../modules/board'
import StrictModeDroppable from '../layout/StrictModeDroppable/StrictModeDroppable'
import StatusColumn from './StatusColumn'
import { BoardContainer } from './styles/Board.styled'

const Board = () => {
  const [statuses, setStatuses] = useLocalStorage('statuses', STATUSES)

  const handleDragEnd = ({ source, destination }: DropResult) => {
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    )
      return

    setStatuses(calculateDragState({ source, destination }))
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <StrictModeDroppable
        droppableId='board'
        type='board'
        direction='horizontal'
      >
        {({ droppableProps, innerRef, placeholder }) => (
          <BoardContainer {...droppableProps} ref={innerRef}>
            {statuses.map((status, index) => (
              <StatusColumn {...status} key={status.title} index={index} />
            ))}
            {placeholder}
          </BoardContainer>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  )
}

export default Board
