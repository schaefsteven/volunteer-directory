'use client' 
import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import styles from './Test.module.css'
import cn from 'classnames'

//todo:

export const AvailabilitySelector = ({ path }) => {
  const { value = [], setValue } = useField({ path })
  const [showModal, setShowModal] = useState(false)
  
  const uiFormat = (dbAvail) => {
    // converts the availability array into the format used by the ui
    let id = 0
    const array = Array(7).fill().map(() => [])
    for (let block of dbAvail || []) {
      let row = Math.floor(block.start/24)
      array[row].push({
        "start": block.start % 24, 
        "end": block.end % 24, 
        "id": id++
      })
    }
    return array
  }

  const dbFormat = (uiAvail) => {
    let array = []
    for (let rowIndex in uiAvail) {
      for (let block of uiAvail[rowIndex]) {
        array.push({
          "start": hourOfWeek(block.start, rowIndex),
          "end": hourOfWeek(block.end, rowIndex)
        })
      }
    }
    return array.sort((a, b) => a.start - b.start)
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
    }
    setValue([...(value || []), newBlock].sort((a, b) => a.start - b.start))
  }
  
  const handleDeleteTimeBlock = (id, rowIndex) => {
    const newUiAvail = [...uiAvail]
    newUiAvail[rowIndex] = newUiAvail[rowIndex].filter((el) => el.id !== id)
    setValue(dbFormat(newUiAvail))
  }

  const uiAvail = uiFormat(value)

  return (
    <div>
      {uiAvail.map((timeBlocks, rowIndex) => (
        <Row
          key={rowIndex}
          rowIndex={rowIndex}
          timeBlocks={timeBlocks}
          handleAddTimeBlock={handleAddTimeBlock}
          handleEditTimeBlock={handleEditTimeBlock}
          handleDeleteTimeBlock={handleDeleteTimeBlock}
        />
      ))}
      {showModal && <EditModal/>}
    </div>
  )
}

const Row = ({rowIndex, timeBlocks, handleAddTimeBlock, handleEditTimeBlock, handleDeleteTimeBlock}) => {
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
              handleDeleteTimeBlock={handleDeleteTimeBlock}
              id={id}
              rowIndex={rowIndex}
            />
          )
        }
      )}
    </div>
  )
}

const TimeBlock = ({start, end, rowIndex, handleEditTimeBlock, handleDeleteTimeBlock, id}) => {
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
      <div 
        role="button"
        onClick={() => handleDeleteTimeBlock(id, rowIndex)}
      >
        delete
      </div>
      <span>{id}</span>
    </div>
  )
}

const EditModal = () => {
  return (
    <p>EDIT MODAL</p>
  )
}

export default AvailabilitySelector
