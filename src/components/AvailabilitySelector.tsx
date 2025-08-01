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

  const editModalRef = useRef(null)

  const createTime = (day, hour, minute) => {
    return setDay(setHours(setMinutes(DEFAULT_DATE, minute), hour), day)
  }

  const handleAddTimeBlock = (day) => {
    const newBlock = interval(
      createTime(day, 6, 15),
      createTime(day, 14, 45)
    )
    setValue([...value, newBlock])
  }
  
  const handleDeleteTimeBlock = (index, day) => {
    const newValue = [...rows]
    newValue[day].splice(index, 1)
    setValue(newValue.flat())
  }

  const rows = Array(7).fill().map(() => [])
  for (let block of value) {
    rows[getDay(block.start)].push(block)
  }


  return (
    <div
      className="border-8"
    >
      {rows.map((timeBlocks, day) => (
        <Row
          key={day}
          day={day}
          timeBlocks={timeBlocks}
          handleAddTimeBlock={handleAddTimeBlock}
          handleDeleteTimeBlock={handleDeleteTimeBlock}
          editModalRef={editModalRef}
        />
      ))}
      {
        <EditModal
          editModalRef={editModalRef}
        />
      }
    </div>
  )
}

const Row = ({day, timeBlocks, handleAddTimeBlock, handleDeleteTimeBlock, editModalRef}) => {
  const labels = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

  return (
    <div key={day} className={cn(styles.avsel_row)}>
      <label>{labels[day]}</label>
      <div 
        role="button" 
        className={cn(styles.avsel_add_button)}
        onClick={() => handleAddTimeBlock(day)}
      >
        +
      </div>
      {timeBlocks.map(
        (block, index) => {
          return (
            <TimeBlock
              key={index}
              start={block.start}
              end={block.end}
              handleDeleteTimeBlock={handleDeleteTimeBlock}
              editModalRef={editModalRef}
              id={index}
              day={day}
            />
          )
        }
      )}
    </div>
  )
}

const TimeBlock = ({start, end, day, handleDeleteTimeBlock, editModalRef, id}) => {
  return (
    <div 
      className={cn(styles.avsel_time_block)}
    >
      <span>{format(start, TIME_FORMAT)}</span>
      <span>-</span>
      <span>{format(end, TIME_FORMAT)}</span>
      <div 
        role="button"
        onClick={() => editModalRef.current.showModal()}
      >
        edit
      </div>
      <div 
        role="button"
        onClick={() => handleDeleteTimeBlock(id, day)}
      >
        delete
      </div>
    </div>
  )
}

const EditModal = ({ editModalRef }) => {
  return (
    <>
      <dialog 
        ref={editModalRef}
        className="bg-white"
      >
        <div>
          <header>
            <h2
              className="text-red-50"
            >
              Edit Time Block
            </h2>
            <button
              onClick={() => editModalRef.current.close()}
              type="button"
            >
              x
            </button>
          </header>
          <main>
            <p>put edit fields here</p>
          </main>
          <footer>
            <button>Save</button>
            <button>Cancel</button>
            <button>Delete</button>
          </footer>
        </div>
      </dialog>
    </>
  )
}

export default AvailabilitySelector
