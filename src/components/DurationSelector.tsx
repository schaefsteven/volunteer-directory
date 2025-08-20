'use client'
import { useState, useEffect } from 'react'
import { useField } from '@payloadcms/ui'

// TODO: 
// improve parsing, handle edge-cases
// styling

const DurationSelector = ({ path }) => {
  const { value, setValue } = useField({ path })
  const [dispValue, setDispValue] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  // init dispValue
  useEffect(() => {
    if (value !== undefined && !isEditing) {
      setDispValue(formatDuration(value))
    }
  }, [])

  const parseInput = (string) => {
    // keep only numbers and :
    string = string.replace(/[^0-9:]/g, '')
    if (string.includes(":")) {
      const [hours, minutes] = string.split(":").map(Number)
    } else {
      const [hours, minutes] = [0, parseInt(string)]
    }
    return hours * 60 + minutes
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const dispMin = minutes % 60
    return `${hours}:${dispMin.toString().padStart(2, '0')}`
  }

  const handleChange = (e) => {
    setDispValue(e.target.value)
    setValue(parseInput(e.target.value))
  }

  const handleFocus = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    setDispValue(formatDuration(value))
  }

  return (

    <div>
      <label 
        htmlFor="duration-select"
      >
        Minimum Time Block
      </label>
      <input
        id="duration-select"
        placeholder="HH:MM"
        onBlur={handleBlur}
        onFocus={handleFocus}
        onChange={handleChange}
        value={dispValue}
      />
    </div>
  )
}

export default DurationSelector
