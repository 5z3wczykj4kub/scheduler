import { lensProp, map, prop, set, when } from 'ramda'
import { Dispatch, SetStateAction } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import * as SCHEDULE from '../modules/schedule'
import { Row } from '../types/row'

const useSchedules = () => {
  const [schedules, setSchedules] = useLocalStorage(
    'schedules',
    SCHEDULE.INITIAL_VALUES
  )

  const schedule = SCHEDULE.findSelected(schedules)!

  const setRows: Dispatch<SetStateAction<Row[]>> = (
    rows: Row[] | ((rows: Row[]) => Row[])
  ) =>
    setSchedules(
      map(
        when(
          prop('selected'),
          set(
            lensProp('rows'),
            typeof rows === 'function' ? rows(schedule.rows) : rows
          )
        )
      )
    )

  return { schedule, schedules, setSchedules, setRows }
}

export default useSchedules