'use client'
import React from 'react'
import { useState, useRef } from 'react'
import { useField } from '@payloadcms/ui'
import styles from './Test.module.css'
import cn from 'classnames'

export const AvailabilitySelector = ({ path }) => {
  const { value, setValue } = useField({ path })

  const [availability, setAvailability] = useState(value)

  const blocks = {
    sun: [],
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
  }

  for (let block in availability) {
  }

  const labels = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

  const rows = []

  const addTimeBlock = () => {
  }

{for (let i = 0; i < 7; i++) {
  rows.push(
    <div key={i} className={cn(styles.avsel_row)}>
      <label>{labels[i]}</label>
      <div 
        role="button" 
        className={cn(styles.avsel_add_button)}
        onClick={() => addTimeBlock()}
      >
        +
      </div>
      <TimeBlock/>
      <p>{availability[i]?.start}</p>
    </div>
  )
}}


  return (
    <div>
      {rows}
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
