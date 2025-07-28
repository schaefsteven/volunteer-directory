'use client' 
import React from 'react'
import { useState, useRef } from 'react'
import { useField } from '@payloadcms/ui'
import styles from './Test.module.css'
import cn from 'classnames'

//todo:

export const AvailabilitySelector = ({ path }) => {
  const { value: dbValue = [], setValue: setDbValue } = useField({ path })
  const [showModal, setShowModal] = useState(false)

  const dbFormat = (uiAvail) => {
    // converts the availability array into the format stored in the database
    let dbAvail = []
    for (let day of uiAvail) {
      for (let block of day) {
        dbAvail.push({
          "start": hourOfWeek(block.start),
          "end": hourOfWeek(block.end)
        })
      }
    }
    return dbAvail
  }

  const uiFormat = (dbAvail) => {
    // converts the availability array into the format used by the ui
    const array = Array(7).fill().map(() => [])
    for (let block of dbAvail || []) {
      let row = Math.floor(block.start/24)
      array[row].push({
        "start": block.start % 24, 
        "end": block.end % 24, 
        "id": generateId()
      })
    }
    return array
  }

  const lastId = useRef(0);
  const generateId = () => ++lastId.current

  const [uiValue, setUiValue] = useState(uiFormat(dbValue))

  const setValue = (uiValue) => {
    setUiValue(uiValue)
    setDbValue(dbFormat(uiValue))
  }

  const hourOfWeek = (hour, day) => {
    return hour + (day * 24)
  }
  
  const handleEditTimeBlock = () => {
    setShowModal((showModal) => !showModal)
  }

  const handleAddTimeBlock = (rowIndex) => {
    const newBlock = { 
      "start": hourOfWeek(8, rowIndex), 
      "end": hourOfWeek(12, rowIndex),
      "id" : generateId()
    }
    setValue([...(value || []), newBlock])
  }
  
  const handleDeleteTimeBlock = (id) => {
  }

  return (
    <div>
      {uiValue.map((timeBlocks, rowIndex) => (
        <Row
          key={rowIndex}
          rowIndex={rowIndex}
          timeBlocks={timeBlocks}
          handleAddTimeBlock={handleAddTimeBlock}
          handleEditTimeBlock={handleEditTimeBlock}
        />
      ))}
      {showModal && <EditModal/>}
    </div>
  )
}

const Row = ({rowIndex, timeBlocks, handleAddTimeBlock, handleEditTimeBlock}) => {
  const labels = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

  return (
    <div key={rowIndex} className={cn(styles.avsel_row)}>
      <label>{labels[rowIndex]}</label>
      <div 
        role="button" 
        className={cn(styles.avsel_add_button)}
        onClick={() => handleAddTimeBlock(rowIndex)}
      >
        +
      </div>
      {timeBlocks.map(
        ({start, end, id}) => {
          return (
            <TimeBlock
              key={id}
              start={start}
              end={end}
              handleEditTimeBlock={handleEditTimeBlock}
            />
          )
        }
      )}
    </div>
  )
}

const TimeBlock = ({start, end, handleEditTimeBlock}) => {
  const timeFormat = (num) => {
    if (num < 12) {
      return num + 'am'
    } else if (num == 12) {
      return num + 'pm'
    } else if (num != 24) {
      return num - 12 + 'pm'
    } else {
      return num - 12 + 'am'
    }
  }
  return (
    <div 
      className={cn(styles.avsel_time_block)}
    >
      <span>{timeFormat(start)}</span>
      <span>-</span>
      <span>{timeFormat(end)}</span>
      <div 
        role="button"
        onClick={handleEditTimeBlock}
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

export default AvailabilitySelector
