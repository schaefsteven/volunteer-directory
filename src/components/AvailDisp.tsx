'use client'
import React from 'react'
import { useField } from '@payloadcms/ui'

type TimeSlot = {
  start: number
  end: number
  id?: string
}

export const AvailabilityDisplay: React.FC = () => {
  // Properly access the field data using Payload's useField hook
  const { value } = useField<TimeSlot[]>({ path: 'schedule.availability' })
  
  console.log('Raw value from useField:', value) // Debugging

  // Handle all possible data states
  const availability: TimeSlot[] = (() => {
    if (value === undefined) {
      console.warn('Field value is undefined - check your field path')
      return []
    }
    if (value === null) {
      console.warn('Field value is null')
      return []
    }
    if (!Array.isArray(value)) {
      console.warn('Field value is not an array:', value)
      return []
    }
    return value
  })()

  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
      <h3 style={{ marginTop: 0 }}>Volunteer Shifts</h3>
      
      {availability.length === 0 ? (
        <p>No shifts scheduled</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {availability.map((slot, index) => (
            <div 
              key={slot.id || index}
              style={{
                padding: '0.75rem',
                border: '1px solid #eee',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Shift #{index + 1}</strong>
                {slot.id && <small style={{ color: '#666' }}>ID: {slot.id}</small>}
              </div>
              <div>Start: {slot.start}</div>
              <div>End: {slot.end}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AvailabilityDisplay
