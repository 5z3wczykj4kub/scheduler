import NotificationsIcon from '@mui/icons-material/Notifications'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import { Box, IconButton, Stack, Tooltip } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { none } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { once, trim } from 'ramda'
import { Dispatch, MouseEventHandler, SetStateAction, useCallback } from 'react'
import { useBoolean, useInterval } from 'usehooks-ts'
import * as NOTIFICATION from '../../modules/notification'
import * as ROW from '../../modules/row'
import * as TIME from '../../modules/time'
import { NotificationConfiguration } from '../../types/notification'
import { Row } from '../../types/row'
import NotificationDialog from './NotificationDialog'

interface NotificationCellProps extends GridRenderCellParams<any, Row> {
  setRows: Dispatch<SetStateAction<Row[]>>
}

const NotificationCell = ({
  id,
  field,
  row,
  setRows,
}: NotificationCellProps) => {
  const {
    value: isNotificationDialogOpen,
    setFalse: closeNotificationDialog,
    setTrue: openNotificationDialog,
  } = useBoolean(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const notifyOnce = useCallback(
    pipe(row.notification?.title || 'Notification', NOTIFICATION.notify, once),
    [row.notification?.time]
  )

  /**
   * TODO:
   * Lift this hook up as it is only
   * notifying when the component is rendered.
   * Consider adding a service worker to further improve notifications behavior.
   */
  useInterval(
    () =>
      row.notification?.active &&
      TIME.matches(row.notification?.time, Date.now())
        ? notifyOnce()
        : none,
    1000
  )

  const handleNotificationIconButtonClick:
    | MouseEventHandler<HTMLButtonElement>
    | undefined = () =>
    setRows(
      ROW.update(
        field,
        {
          time: row.notification?.time || row.starts,
          active: !row.notification?.active,
          title: row.notification?.title,
        },
        id
      )
    )

  const handleNotificationIconButtonContextMenu:
    | MouseEventHandler<HTMLButtonElement>
    | undefined = (event) => {
    event.preventDefault()
    openNotificationDialog()
  }

  const handleNotificationConfigurationSave = (
    values: NotificationConfiguration
  ) => {
    setRows(
      ROW.update(
        'notification',
        {
          active: !!row.notification?.active,
          time: NOTIFICATION.calculateTime(row.starts!, values),
          title: trim(values.title),
        },
        id
      )
    )
    closeNotificationDialog()
  }

  return (
    <>
      <Stack
        direction='row'
        justifyContent='center'
        alignItems='center'
        width='100%'
      >
        <Tooltip
          title={
            row.starts
              ? 'Right-click to configure'
              : 'Set start time to enable notification'
          }
          placement='left'
          disableTouchListener
        >
          <Box>
            <IconButton
              size='small'
              disabled={!row.starts}
              onClick={handleNotificationIconButtonClick}
              onContextMenu={handleNotificationIconButtonContextMenu}
            >
              {row.notification?.active ? (
                <NotificationsIcon fontSize='small' />
              ) : (
                <NotificationsNoneIcon fontSize='small' />
              )}
            </IconButton>
          </Box>
        </Tooltip>
      </Stack>
      <NotificationDialog
        open={isNotificationDialogOpen}
        onClose={closeNotificationDialog}
        row={row as Row & { starts: string }}
        onSave={handleNotificationConfigurationSave}
      />
    </>
  )
}

export default NotificationCell
