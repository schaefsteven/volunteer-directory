'use client' 
import { useEffect } from 'react'
import { SelectFieldClientComponent } from 'payload'
import { useField, SelectField, fieldBaseClass } from '@payloadcms/ui'
import styles from './TimezoneSelector.module.css'
import cn from 'classnames'

const DEVICE_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

const TimezoneSelector: SelectFieldClientComponent = (props) => {

  // default to device timezone when creating new listing
  const { value, setValue } = useField({ path: props.path })
  useEffect(() => {
    if (value === undefined) {
      setValue(DEVICE_TIMEZONE)
    }
  }, [])

  return (
    <div className={fieldBaseClass}>
      <SelectField {... props} />
      {
        (value != DEVICE_TIMEZONE) && 
        <div className={cn(styles.tz_alert)}>
          This is not your device's current timezone.
        </div>
      }
    </div>
  )

}

export default TimezoneSelector
