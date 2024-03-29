import DownloadIcon from '@mui/icons-material/Download'
import EditIcon from '@mui/icons-material/Edit'
import PrintIcon from '@mui/icons-material/Print'
import SaveIcon from '@mui/icons-material/Save'
import ViewListIcon from '@mui/icons-material/ViewList'
import { SpeedDial, SpeedDialAction } from '@mui/material'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import { pipe } from 'fp-ts/lib/function'
import { trim } from 'ramda'
import { useBoolean } from 'usehooks-ts'
import useSchedules from '../../hooks/useSchedules'
import * as SCHEDULE from '../../modules/schedule'
import SaveScheduleDialog from './SaveScheduleDialog'
import SchedulesDrawer from './SchedulesDrawer'
import { isUnsaved } from '../../modules/common'
import useProjects from '@/hooks/useProjects'

const ScheduleActions = () => {
  const { project } = useProjects()

  const { schedule, schedules, setSchedules } = useSchedules()

  const {
    value: isSchedulesDrawerOpen,
    setFalse: closeSchedulesDrawer,
    setTrue: openSchedulesDrawer,
  } = useBoolean()

  const {
    value: isSaveScheduleDialogOpen,
    setFalse: closeSaveScheduleDialog,
    setTrue: openSaveScheduleDialog,
  } = useBoolean()

  const handleScheduleCreate = () => {
    setSchedules(SCHEDULE.create(project))
    closeSchedulesDrawer()
  }

  const handleScheduleDelete = (name: string) => {
    setSchedules(SCHEDULE.remove(project, name))
    closeSchedulesDrawer()
  }

  const handleScheduleSelect = (name: string) => {
    setSchedules(SCHEDULE.select(project, name))
    closeSchedulesDrawer()
  }

  const handleScheduleSave = ({ name }: { name: string }) => {
    setSchedules(pipe(name, trim, SCHEDULE.save(project)))
    closeSaveScheduleDialog()
  }

  return (
    <>
      <SpeedDial
        ariaLabel='speed-dial'
        icon={<SpeedDialIcon />}
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
        }}
      >
        <SpeedDialAction
          tooltipTitle='Download'
          icon={<DownloadIcon />}
          onClick={SCHEDULE.exportToXLSX(schedule)}
        />
        <SpeedDialAction
          tooltipTitle='Print'
          icon={<PrintIcon />}
          onClick={window.print}
        />
        <SpeedDialAction
          tooltipTitle={isUnsaved(schedule) ? 'Save' : 'Rename'}
          icon={isUnsaved(schedule) ? <SaveIcon /> : <EditIcon />}
          onClick={openSaveScheduleDialog}
        />
        <SpeedDialAction
          tooltipTitle='Schedules'
          icon={<ViewListIcon />}
          onClick={openSchedulesDrawer}
        />
      </SpeedDial>
      <SchedulesDrawer
        open={isSchedulesDrawerOpen}
        onOpen={openSchedulesDrawer}
        onClose={closeSchedulesDrawer}
        schedule={schedule}
        schedules={schedules}
        onCreate={handleScheduleCreate}
        onDelete={handleScheduleDelete}
        onSelect={handleScheduleSelect}
      />
      <SaveScheduleDialog
        open={isSaveScheduleDialogOpen}
        onClose={closeSaveScheduleDialog}
        schedule={schedule}
        schedules={schedules}
        onSave={handleScheduleSave}
      />
    </>
  )
}

export default ScheduleActions
