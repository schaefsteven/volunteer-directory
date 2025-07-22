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
  const [dbAvailability, setDbAvailability] = useState(value)
  const [showModal, setShowModal] = useState(false)

  let availability = Array(7).fill().map(() => [])

  for (let block of dbAvailability) {
    let row = Math.floor(block.start / 24)
    availability[row].push([block.start % 24, block.end % 24])
  }

  const handleAddTimeBlock = (row) => {
    console.log('add time block to: ', row)
    availability[row].push([8, 16])
  }

  const Row = (row) => {
    const labels = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    return (
      <div key={row} className={cn(styles.avsel_row)}>
        <label>{labels[row]}</label>
        <div 
          role="button" 
          className={cn(styles.avsel_add_button)}
          onClick={() => handleAddTimeBlock(row)}
        >
          +
        </div>
        {availability[row].map(
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
    const timeFormat = (num) => {
      if (num < 12) {
        return num + 'am'
      } else if (num != 24) {
        return num - 12 + 'pm'
      } else {
        return num - 12 + 'am'
      }
    }
    return (
      <div 
        className={cn(styles.avsel_time_block)}
        key={start}
      >
        <span>{timeFormat(start)}</span>
        <span>-</span>
        <span>{timeFormat(end)}</span>
        <div 
          role="button"
          onClick={() => {setShowModal(!showModal); console.log(showModal)}}
        >
          edit
        </div>
      </div>
    )
  }

  const EditModal = () => {
    return (
      <p>EDIT MODAL</p>
    )
  }

  let rows = []

  {for (let i = 0; i < 7; i++) {
    rows.push(
      Row(i)
    )
  }}

  return (
    <div>
      {rows}
      {showModal && <EditModal/>}
    </div>
  )
}

export default AvailabilitySelector
