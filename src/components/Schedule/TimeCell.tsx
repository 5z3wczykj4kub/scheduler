import { TextField } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { DesktopTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Dispatch, SetStateAction } from 'react'
import * as ROW from '../../modules/row'
import { Row } from '../../types/row'

interface TimeCellProps extends GridRenderCellParams<any, Row> {
  rows: Row[]
  setRows: Dispatch<SetStateAction<Row[]>>
}

const TimeCell = ({ id, field, row, rows, setRows }: TimeCellProps) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DesktopTimePicker
      value={row[field as keyof Row] || null}
      onChange={(value) => setRows(ROW.update(field, value, id, rows))}
      renderInput={(params) => (
        <TextField
          {...params}
          size='small'
          inputProps={{ ...params.inputProps, placeholder: '' }}
        />
      )}
      OpenPickerButtonProps={{
        size: 'small',
        sx: { translate: 6, svg: { width: 20, height: 20 } },
      }}
    />
  </LocalizationProvider>
)

export default TimeCell
