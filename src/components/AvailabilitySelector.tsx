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

  const [editingBlock, setEditingBlock] = useState(null)
  const [editingBlockID, setEditingBlockID] = useState(null)

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
  
  const handleDeleteTimeBlock = (day, index) => {
    const newValue = [...rows]
    newValue[day].splice(index, 1)
    setValue(newValue.flat())
  }

  const handleShowEditModal = (day, index) => {
    editModalRef.current.showModal()
    setEditingBlock(rows[day][index])
    setEditingBlockID({
      'day': day,
      'index': index
    })
  }

  const rows = Array(7).fill().map(() => [])
  for (let block of value) {
    rows[getDay(block.start)].push(block)
  }


  return (
    <div>
      {rows.map((timeBlocks, day) => (
        <Row
          key={day}
          day={day}
          timeBlocks={timeBlocks}
          handleAddTimeBlock={handleAddTimeBlock}
          handleShowEditModal={handleShowEditModal}
        />
      ))}
      {
        <EditModal
          editModalRef={editModalRef}
          handleDeleteTimeBlock={handleDeleteTimeBlock}
          editingBlockID={editingBlockID}
        />
      }
    </div>
  )
}

const Row = ({day, timeBlocks, handleAddTimeBlock, handleShowEditModal}) => {
  const labels = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

  return (
    <div key={day} className={cn(styles.avsel_row)}>
      <label>{labels[day]}</label>
      <button 
        role="button" 
        type="button"
        className={cn(styles.avsel_add_button)}
        onClick={() => handleAddTimeBlock(day)}
      >
        +
      </button>
      {timeBlocks.map(
        (block, index) => {
          return (
            <TimeBlock
              key={index}
              start={block.start}
              end={block.end}
              index={index}
              day={day}
              handleShowEditModal={handleShowEditModal}
            />
          )
        }
      )}
    </div>
  )
}

const TimeBlock = ({start, end, day, handleShowEditModal, index}) => {
  return (
    <div 
      className={cn(styles.avsel_time_block)}
    >
      <span>{format(start, TIME_FORMAT)}</span>
      <span>-</span>
      <span>{format(end, TIME_FORMAT)}</span>
      <div 
        role="button"
        onClick={() => handleShowEditModal(day, index)}
      >
        edit
      </div>
    </div>
  )
}

const EditModal = ({ editModalRef, handleDeleteTimeBlock, editingBlockID }) => {
  return (
    <>
      <dialog 
        ref={editModalRef}
        className={cn(styles.avsel_modal)}
      >
        <div>
          <header>
            <h2>
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
            <button
              onClick={() => {}}
              type="button"
            >
              Save
            </button>
            <button
              onClick={() => {}}
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeleteTimeBlock(editingBlockID.day, editingBlockID.index)}
              type="button"
            >
              Delete
            </button>
          </footer>
        </div>
      </dialog>
    </>
  )
}

export default AvailabilitySelector
