'use client'
import React from 'react'
import { useState, useRef } from 'react'
import { useField } from '@payloadcms/ui'
import styles from './Test.module.css'
import cn from 'classnames'

export const AvailabilitySelector = ({ path }) => {
  const { value, setValue } = useField({ path })

  console.log('raw value:', value)

  const [availability, setAvailability] = useState(value)

  const labels = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

  return (
    <div>
      {labels.map((label, index) => (
        <div key={label} className={cn(styles.avsel_row)}>
          <label>{label}</label>
          <div 
            role="button" 
            className={cn(styles.avsel_add_button)}
            onClick={() => addTimeBlock()}
          >
            +
          </div>
          <TimeBlock/>
          <p>{index}</p>
        </div>
      ))}
    </div>
  )
}

const TimeBlock = () => {
  return (
    <div className={cn(styles.avsel_time_block)}>
      <span>9:00am</span>
      <span>-</span>
      <span>6:00pm</span>
      <div role="button">edit</div>
    </div>
  )
}

export default AvailabilitySelector
