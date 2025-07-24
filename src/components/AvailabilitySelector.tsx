'use client' 
import React from 'react'
import { useState, useRef } from 'react'
import { useField } from '@payloadcms/ui'
import styles from './Test.module.css'
import cn from 'classnames'

//todo:
//re-write as separate components
//store state in parent component availability
//replace availability when editing to re-render

export const AvailabilitySelector = ({ path }) => {
  const { value, setValue } = useField({ path })
  const [dbAvailability, setDbAvailability] = useState(value)
  const [showModal, setShowModal] = useState(false)

  const [availability, setAvailability] = useState(() => {
    const array = Array(7).fill().map(() => [])
    for (let block of value || []) {
      let row = Math.floor(block.start/24)
      array[row].push([block.start % 24, block.end % 24])
    }
    return array
  })

  const handleEditTimeBlock = () => {
    setShowModal((showModal) => !showModal)
  }

  const handleAddTimeBlock = (rowIndex) => {
    //availability[row].push([8, 16])
    //setTimeBlocks(prevTimeBlocks => [ ...prevTimeBlocks, [8, 16]])
    console.log("add time block to row " + rowIndex)
    setAvailability((oldAvail) => {
      const newAvail = [...oldAvail]
      newAvail[rowIndex] = [
        ...newAvail[rowIndex], 
        [8, 16]
      ]
      return newAvail
    })
  }

  return (
    <div>
      {availability.map((timeBlocks, rowIndex) => (
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
        ([start, end]) => {
          return (
            <TimeBlock
              key={start+end}
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
