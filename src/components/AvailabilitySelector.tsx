'use client' 
import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import styles from './Test.module.css'
import cn from 'classnames'
import { interval, setHours, setDay, setMinutes, getDay, format, parse, fromUnixTime } from "date-fns"
import { DEFAULT_DATE } from '@/constants'

//todo:
//date-fns for datetime object handling and interval comparison
//chrono-node for time parsing
//

const TIME_FORMAT = 'h:mm aaa'

export const AvailabilitySelector = ({ path }) => {

  const { value = [], setValue } = useField({ path })
  const [showModal, setShowModal] = useState(false)

  const setTime = (day, hour, minute) => {
    return setDay(setHours(setMinutes(DEFAULT_DATE, minute), hour), day)
  }

  const handleEditTimeBlock = () => {
    setShowModal((showModal) => !showModal)
  }

  const handleAddTimeBlock = (day) => {
    const newBlock = {
      "interval": interval(
        setTime(day, 6, 15),
        setTime(day, 14, 45)
      ),
      "id": value[day].length
    }
    const newValue = [...value]
    newValue[day].push(newBlock)
    setValue(newValue)
  }
  
  const handleDeleteTimeBlock = (id, day) => {
    const newValue = [...value]
    newValue[day] = newValue[day].filter((el) => el.id != id)
    setValue(newValue)
  }


  return (
    <div>
      {value.map((timeBlocks, rowIndex) => (
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
        ({interval, id}) => {
          return (
            <TimeBlock
              key={id}
              start={interval.start}
              end={interval.end}
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
    if (num < 1) {
      return num + 12 + 'am'
    } else if (num < 12) {
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
      <span>{format(start, TIME_FORMAT)}</span>
      <span>-</span>
      <span>{format(end, TIME_FORMAT)}</span>
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
