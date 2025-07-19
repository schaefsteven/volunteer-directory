'use client'
import React from 'react'
import { useState, useRef } from 'react'
import { useField } from '@payloadcms/ui'
import styles from './Test.module.css'
import cn from 'classnames'

//todo:
//let's store availability in the database as: [{start:1, end:2}, ...]
//The component needs to initialize by converting this into a format that it can use easier
//on save, we will convert back to the storage format. 
//component format will be a dict with numbered keys for rows and arrays of time blocks. 
//split the rows into their own component, and when we edit, we will replace the row's object so it udpates (and sorts)

export const AvailabilitySelector = ({ path }) => {
  const { value, setValue } = useField({ path })

  const [availability, setAvailability] = useState(value)

  let timeBlocks = [[], [], [], [], [], [], []] 

  for (let block of availability) {
    let row = Math.floor(block.start / 24)
    timeBlocks[row].push([block.start % 24, block.end % 24])
  }

  console.log(timeBlocks)

  let rows = []

  const addTimeBlock = () => {
  }

  const Row = (row) => {
    const labels = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    return (
      <div key={row} className={cn(styles.avsel_row)}>
        <label>{labels[row]}</label>
        <div 
          role="button" 
          className={cn(styles.avsel_add_button)}
          onClick={() => addTimeBlock()}
        >
          +
        </div>
        {timeBlocks[row].map(
          ([start, end]) => {
            return (
              TimeBlock(start, end)
            )
          }
        )}
      </div>
    )
  }

  const TimeBlock = (start, end) => {
    return (
      <div 
        className={cn(styles.avsel_time_block)}
        key={start}
      >
        <span>{start}</span>
        <span>-</span>
        <span>{end}</span>
        <div role="button">edit</div>
      </div>
    )
  }

  {for (let i = 0; i < 7; i++) {
    rows.push(
      Row(i)
    )
  }}

  return (
    <div>
      {rows}
    </div>
  )
}

export default AvailabilitySelector
