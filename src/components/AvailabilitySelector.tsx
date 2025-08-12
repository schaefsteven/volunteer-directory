'use client' 
import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import styles from './Test.module.css'
import cn from 'classnames'
import { format } from "date-fns"
import { UTCDateMini, utc } from "@date-fns/utc"
import { rawTimeZones } from '@vvo/tzdb'

//todo:
//chrono-node for time parsing
//timezone selector cleanup

const TIMEZONE_LIST = rawTimeZones.map((tz) => tz.name)
const DEVICE_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

export const AvailabilitySelector = ({ path }) => {

  // set up states etc
  const { value = { 'timeBlocks': [], 'timeZone': null }, setValue } = useField({ path })
  const [timeZone, setTimeZone] = useState( value.timeZone || DEVICE_TIMEZONE )
  const [editContext, setEditContext] = useState(null)
  const editModalRef = useRef(null)

  // helpers
  const createTime = (day, hour = 0, minute = 0) => {
    // returns minutes of the week from day, hour, minute
    return (day * 1440) + (hour * 60) + minute
  }

  const uiTimeFormat = (minutesOfWeek) => {
    // converts hours of the week to a 12-hour time
    const minutesOfDay = minutesOfWeek % 1440
    return format(new UTCDateMini(1970, 0, 1, 0, minutesOfDay, 0), 'h:mm aaa', {in: utc})
  }

  const areBlocksOverlapping = (block1, block2) => {
    return (block1.start <= block2.end && block1.end >= block2.start)
  }

  const rowsToValue = (rows) => {
    // flatten and sort
    const flatSort = rows.flat().sort((a, b) => a.start - b.start)
    if (flatSort.length == 0) {
      // return here if array is empty
      return flatSort
    }
    // merge overlapping timeBlocks
    const merged = [flatSort[0]]
    for (let i = 1; i< flatSort.length; i++) {
      const current = flatSort[i]
      const lastMerged = merged[merged.length-1]
      if (areBlocksOverlapping(lastMerged, current)) {
        lastMerged.end = current.end
      } else {
        merged.push(current)
      }
    }
    return {
      'timeBlocks': merged, 
      'timeZone': timeZone
    }
  }

  // handlers
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
    setValue(rowsToValue(newRows))
    editModalRef.current.close()
  }

  const handleCancelButton = () => {
    editModalRef.current.close()
  }
 
  const handleSaveButton = (start, end) => {
    // keep the rows structure so we can use the editContext
    const newRows = [...rows]
    const newBlock = {
      'start': createTime(editContext.day, parseInt(start), 0),
      'end': createTime(editContext.day, parseInt(end), 0)
    }
    if (editContext.mode == 'edit') {
      newRows[editContext.day][editContext.index] = newBlock
    } else {
      newRows[editContext.day].push(newBlock)
    }
    setValue(rowsToValue(newRows))
    editModalRef.current.close()
  }

  const handleTimezoneChange = (e) => {
    setTimeZone(e.target.value)
  }

  const getDay = (minutesOfWeek) => Math.floor(minutesOfWeek / 1440)

  const rows = Array(7).fill().map(() => [])
  for (let block of value?.timeBlocks) {
    // split blocks that span midnight and add them to the rows array
    const startDay = getDay(block.start)
    const endDay = getDay(block.end - 1)
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
      rows[startDay + i].push({ 'start': startTime, 'end': endTime })
    }
  }

  return (
    <div>
      <label 
        htmlFor="timezone-select"
      >
        Select Timezone: 
      </label>
      <select
        id="timezone-select"
        value={timeZone}
        onChange={handleTimezoneChange}
      >
        {TIMEZONE_LIST.map((tz) => (
          <option key={tz} value={tz}>
            {tz}
          </option>
        ))}
      </select>
      {(timeZone != DEVICE_TIMEZONE) && <span>This is not your device's current timezone.</span>}
      {rows.map((timeBlocks, day) => (
        <Row
          key={day}
          day={day}
          timeBlocks={timeBlocks}
          handleAddButton={handleAddButton}
          handleEditButton={handleEditButton}
          uiTimeFormat={uiTimeFormat}
        />
      ))}
      {
        <EditModal
          handleDeleteButton={handleDeleteButton}
          handleCancelButton={handleCancelButton}
          handleSaveButton={handleSaveButton}
          editContext={editContext}
          editModalRef={editModalRef}
          uiTimeFormat={uiTimeFormat}
        />
      }
    </div>
  )
}

const Row = ({day, timeBlocks, handleAddButton, handleEditButton, uiTimeFormat}) => {
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
              uiTimeFormat={uiTimeFormat}
            />
          )
        }
      )}
    </div>
  )
}

const TimeBlock = ({start, end, day, handleEditButton, index, uiTimeFormat}) => {
  return (
    <div 
      className={cn(styles.avsel_time_block)}
    >
      <span>{uiTimeFormat(start)}</span>
      <span>-</span>
      <span>{uiTimeFormat(end)}</span>
      <div 
        role="button"
        onClick={() => handleEditButton(day, index)}
      >
        edit
      </div>
    </div>
  )
}

const EditModal = ({ handleDeleteButton, handleCancelButton, handleSaveButton, editContext, editModalRef, uiTimeFormat }) => {
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  useEffect(() => {
    if (editContext?.block) {
      setStartTime(uiTimeFormat(editContext.block.start))
      setEndTime(uiTimeFormat(editContext.block.end))
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
