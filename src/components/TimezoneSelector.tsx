'use client' 
import { useEffect } from 'react'
import { SelectFieldClientComponent } from 'payload'
import { useField, SelectField } from '@payloadcms/ui'

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
    <div>
      <SelectField {... props} />
      {
        (value != DEVICE_TIMEZONE) && 
        <span>
          This is not your device's current timezone.
        </span>
      }
    </div>
  )

}

export default TimezoneSelector
