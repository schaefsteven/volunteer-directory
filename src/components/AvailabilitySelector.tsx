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

  const [editContext, setEditContext] = useState(null)

  const createTime = (day, hour, minute) => {
    return setDay(setHours(setMinutes(DEFAULT_DATE, minute), hour), day)
  }

  const flatSort = (rows) => {
    return rows.flat().sort((a, b) => a.start - b.start)
  }

  const handleAddButton = (day) => {
    setEditContext({'day': day, 'mode': 'add'})
    editModalRef.current.showModal()
  }
  
  const handleEditButton = (day, index) => {
    setEditContext(
      {
        'block': rows[day][index],
        'day': day,
        'index': index,
        'mode': 'edit'
      }
    )
    editModalRef.current.showModal()
  }

  const handleDeleteButton = (day, index) => {
    const newRows = [...rows]
    newRows[day].splice(index, 1)
    setValue(newRows.flat())
    editModalRef.current.close()
  }

  const handleCancelButton = () => {
    editModalRef.current.close()
  }
 
  const handleSaveButton = (start, end) => {
    const newRows = [...rows]
    const newBlock = interval (
      createTime(editContext.day, parseInt(start), 0),
      createTime(editContext.day, parseInt(end), 0)
    )
    if (editContext.mode == 'edit') {
      newRows[editContext.day][editContext.index] = newBlock
    } else {
      newRows[editContext.day].push(newBlock)
    }
    setValue(flatSort(newRows))
    editModalRef.current.close()
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
          handleAddButton={handleAddButton}
          handleEditButton={handleEditButton}
        />
      ))}
      {
        <EditModal
          handleDeleteButton={handleDeleteButton}
          handleCancelButton={handleCancelButton}
          handleSaveButton={handleSaveButton}
          editContext={editContext}
          editModalRef={editModalRef}
        />
      }
    </div>
  )
}

const Row = ({day, timeBlocks, handleAddButton, handleEditButton}) => {
  const labels = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

  return (
    <div key={day} className={cn(styles.avsel_row)}>
      <label>{labels[day]}</label>
      <button 
        role="button" 
        type="button"
        className={cn(styles.avsel_add_button)}
        onClick={() => handleAddButton(day)}
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
              handleEditButton={handleEditButton}
            />
          )
        }
      )}
    </div>
  )
}

const TimeBlock = ({start, end, day, handleEditButton, index}) => {
  return (
    <div 
      className={cn(styles.avsel_time_block)}
    >
      <span>{format(start, TIME_FORMAT)}</span>
      <span>-</span>
      <span>{format(end, TIME_FORMAT)}</span>
      <div 
        role="button"
        onClick={() => handleEditButton(day, index)}
      >
        edit
      </div>
    </div>
  )
}

const EditModal = ({ handleDeleteButton, handleCancelButton, handleSaveButton, editContext, editModalRef }) => {
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  useEffect(() => {
    if (editContext?.block) {
      setStartTime(format(editContext.block.start, TIME_FORMAT))
      setEndTime(format(editContext.block.end, TIME_FORMAT))
    } else {
      setStartTime('')
      setEndTime('')
    }
  }, [editContext])

  return (
    <>
      <dialog 
        ref={editModalRef}
        className={cn(styles.avsel_modal)}
      >
        <div>
          <header>
            <h2>
              {editContext?.mode === 'edit' ? 'Edit Time Block' : 'Add Time Block'}
            </h2>
            <button
              onClick={() => handleCancelButton()}
              type="button"
            >
              x
            </button>
          </header>
          <main>
            <input
              type="text"
              placeholder="Start"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <span>-</span>
            <input
              type="text"
              placeholder="End"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </main>
          <footer>
            <button
              onClick={() => handleDeleteButton(editContext.day, editContext.index)}
              type="button"
            >
              Delete
            </button>
            <button
              onClick={() => handleCancelButton()}
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSaveButton(startTime, endTime)}
              type="button"
            >
              Save
            </button>
          </footer>
        </div>
      </dialog>
    </>
  )
}

export default AvailabilitySelector
