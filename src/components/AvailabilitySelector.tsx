'use client' 
import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import styles from './Test.module.css'
import cn from 'classnames'
import { add, interval, setHours, setDay, setMinutes, getDay, format, areIntervalsOverlapping } from "date-fns"
import { tz } from "@date-fns/tz"
import { DEFAULT_DATE } from '@/constants'

//todo:
//chrono-node for time parsing
//handle weekend wrapping
//timezone selector

const TIME_FORMAT = 'h:mm aaa'
const TZ = tz('America/Los_Angeles')

export const AvailabilitySelector = ({ path }) => {

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  console.log(timeZone)

  const { value = [], setValue } = useField({ path })

  const editModalRef = useRef(null)

  const [editContext, setEditContext] = useState(null)

  const createTime = (day, hour = 0, minute = 0) => {
    if (hour == 24) {
      day ++
    }
    const newTime = setDay(setHours(setMinutes(DEFAULT_DATE, minute), hour), day)
    if (newTime < DEFAULT_DATE) {
      return add(newTime, { 'days': 7 })
    } else if (newTime > add(DEFAULT_DATE, { 'days': 7 })) {
      return add(newTime, { 'days': -7 })
    } else {
      return newTime
    }
  }

  const flatSortMerge = (rows) => {
    const flatSort = rows.flat().sort((a, b) => a.start - b.start)
    if (flatSort.length == 0) {
      return flatSort
    }
    const merged = [flatSort[0]]

    for (let i = 1; i< flatSort.length; i++) {
      const current = flatSort[i]
      const lastMerged = merged[merged.length-1]

      if (areIntervalsOverlapping(lastMerged, current, {inclusive : true})) {
        lastMerged.end = current.end
      } else {
        merged.push(current)
      }
    }
    return merged
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
    setValue(flatSortMerge(newRows))
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
    setValue(flatSortMerge(newRows))
    editModalRef.current.close()
  }

  console.log(value)

  const rows = Array(7).fill().map(() => [])
  for (let block of value) {
    // split blocks that span midnight and add them to the rows array
    const startDay = getDay(block.start)
    const endDay = getDay(add(block.end, {minutes: -1}))
    const numOfBlocks = endDay - startDay + 1
    let startTime
    let endTime
    for (let i = 0; i < numOfBlocks; i++) {
      if (i == 0) {
        startTime = block.start
      } else {
        startTime = createTime(startDay + i)
      }
      if (i == numOfBlocks - 1) {
        endTime = block.end
      } else {
        endTime = createTime(startDay + i + 1)
      }
      rows[startDay + i].push(interval(startTime, endTime))
    }
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
      <span>{format(start, TIME_FORMAT, {in: TZ})}</span>
      <span>-</span>
      <span>{format(end, TIME_FORMAT, {in: TZ})}</span>
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
