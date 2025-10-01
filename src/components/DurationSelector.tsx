'use client'
import { useState, useEffect } from 'react'
import { useField, FieldError, FieldLabel, fieldBaseClass } from '@payloadcms/ui'

const DurationSelector = ({ path, field }) => {
  const { value, setValue, errorMessage, showError } = useField({ path })
  const [dispValue, setDispValue] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  // init dispValue
  useEffect(() => {
    if (value !== undefined && !isEditing) {
      setDispValue(formatDuration(value))
    }
  }, [])

  const stripInvalid = (string) => {
    // keep only numbers and :
    string = string.replace(/[^0-9:]/g, '')
    // keep only the first colon
    const firstColonIndex = string.indexOf(':')
    // if no colons
    if (firstColonIndex === -1) {
      return string
    }
    // split at first colon
    const beforeColon = string.substring(0, firstColonIndex + 1)
    const afterColon = string.substring(firstColonIndex + 1)

    return beforeColon + afterColon.replace(/:/g, '')
  }

  const parseInput = (string) => {
    if (string.length === 0) {
      return 0
    }
    string = stripInvalid(string)
    let parsedMinutes
    if (string.includes(":")) {
      const segments = string.split(":").map(Number)
      if (segments.length > 1) {
        // HH:MM
        const [hours, minutes] = segments
        parsedMinutes = hours * 60 + minutes
      } else { 
        // HH:
        parsedMinutes = segments[0] * 60
      }
    } else {
      // HH
      parsedMinutes = parseInt(string) * 60
    }
    // limit to one week
    if (parsedMinutes > 10080) {
      return 10080
    } else {
      return parsedMinutes
    }
  }

  const formatDuration = (minutes) => {
    if (minutes === undefined) {
      return ''
    }
    const hours = Math.floor(minutes / 60)
    const dispMin = minutes % 60
    return `${hours}:${dispMin.toString().padStart(2, '0')}`
  }

  const handleChange = (e) => {
    const strippedValue = stripInvalid(e.target.value)
    if (strippedValue === '') {
      setDispValue('')
      setValue(undefined)
      return
    }
    setDispValue(stripInvalid(strippedValue))
    setValue(parseInput(e.target.value))
  }

  const handleFocus = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    setDispValue(formatDuration(value))
  }

  const onEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setDispValue(formatDuration(value))
    }
  }

return (

    <div 
      className={[
        fieldBaseClass, 
        'number',
        showError && 'error',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <FieldLabel label={field.label} path={path} required={field.required}/>
      <div className={`${fieldBaseClass}__wrap`}>
        <FieldError
          showError={showError}
          message={errorMessage}
          path={path}
        />

        <input
          id="duration-select"
          placeholder="HH:MM"
          onBlur={handleBlur}
          onFocus={handleFocus}
          onChange={handleChange}
          value={dispValue}
          onKeyDown={onEnter}
          name={path}
        />
      </div>
    </div>
  )
}

export default DurationSelector
