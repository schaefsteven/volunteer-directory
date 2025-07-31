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
//

const TIME_FORMAT = 'h:mm aaa'

export const AvailabilitySelector = ({ path }) => {

  //console.log(format(DEFAULT_DATE, 'eee, MM/dd/yyyy hh:mm'))
  //const sundayDate = setDay(DEFAULT_DATE, 0)
  //console.log(format(sundayDate, 'eee, MM/dd/yyyy hh:mm'))
  //const mondayDate = setDay(DEFAULT_DATE, 1)
  //console.log(format(mondayDate, 'eee, MM/dd/yyyy hh:mm'))
  //const saturdayDate = setDay(DEFAULT_DATE, 7)
  //console.log(format(saturdayDate, 'eee, MM/dd/yyyy hh:mm'))
  //const myInterval = interval(sundayDate, mondayDate)
  //console.log(myInterval)
  //console.log(format(myInterval.start, TIME_FORMAT))

  const { value = [], setValue } = useField({ path })
  const [showModal, setShowModal] = useState(false)

  const num = 1163700
  console.log(fromUnixTime(num))
  
  const uiFormat = (dbAvail) => {
    // converts the availability array into the format used by the ui
    let id = 0
    const array = Array(7).fill().map(() => [])
    for (let block of dbAvail || []) {
      let row = getDay(block.start)
      array[row].push({
        "interval": block,
        "id": id++
      })
    }
    return array
  }

  const setTimeBlock = (day, hour, minute) => {
    return setDay(setHours(setMinutes(DEFAULT_DATE, minute), hour), day)
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
    array = array.sort((a, b) => a.start - b.start)
    for (let [index, block] of array.entries()) {
      if (array?.[index + 1]) {
        console.log('another')
      }
    }
    return array
  }

  const hourOfWeek = (hour, day) => {
    return hour + (day * 24)
  }
  
  const handleEditTimeBlock = () => {
    setShowModal((showModal) => !showModal)
  }

  const handleAddTimeBlock = (rowIndex) => {
    const newBlock = interval(
      setTimeBlock(rowIndex, 6, 15),
      setTimeBlock(rowIndex, 14, 45)
    )
    console.log(typeof newBlock.start)
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
