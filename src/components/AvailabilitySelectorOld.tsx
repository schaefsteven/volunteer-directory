'use client' 
import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import styles from './Test.module.css'
import cn from 'classnames'
import { add, interval, setHours, setDay, setMinutes, getDay, format, areIntervalsOverlapping } from "date-fns"
import { tz, tzOffset } from "@date-fns/tz"
import { utc } from "@date-fns/utc"
import { DEFAULT_DATE } from '@/constants'
import { getTimeZones, rawTimeZones } from '@vvo/tzdb'

//todo:
//chrono-node for time parsing
//handle weekend wrapping
//timezone selector
//
//
//Structure: 
//value.timeBlocks: UTC SDT, normalized/bounded
//rows: UTC SDT

const TIME_FORMAT = 'h:mm aaa'
const TIMEZONE_LIST = rawTimeZones.map((tz) => tz.name)
const DEVICE_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

export const AvailabilitySelector = ({ path }) => {

  // set up states etc
  const { value = { 'timeBlocks': [], 'timeZone': null }, setValue } = useField({ path })
  const [timeZone, setTimeZone] = useState( value.timeZone || DEVICE_TIMEZONE )
  const timeZoneInfo = getTimeZones().find(tz => tz.name === timeZone)
  const utcOffset = timeZoneInfo.rawOffsetInMinutes
  const dstOffset = -utcOffset + timeZoneInfo.currentTimeOffsetInMinutes
  const [editContext, setEditContext] = useState(null)
  const editModalRef = useRef(null)

  console.log("UTC Offset: ", utcOffset)
  console.log("DST Offset: ", dstOffset)

  // helpers
  const createTime = (day, hour = 0, minute = 0) => {
    // creates a date in UTC, SDT
    const newTime = add(DEFAULT_DATE, {
      'days': day,
      'hours': hour, 
      'minutes': minute - utcOffset + dstOffset
    })
    return newTime
  }

  const applyDstOffset = (time) => {
    return add(time, { 'minutes': dstOffset })
  }

  const uiTimeFormat = (time) => {
    return format(applyDstOffset(time), 'h:mm aaa', { in: tz(timeZone) })
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

  const attachTz = (timeBlocks) => {
    return {
      'timeBlocks': timeBlocks, 
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
    setValue(attachTz(flatSortMerge(newRows)))
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
    setValue(attachTz(flatSortMerge(newRows)))
    editModalRef.current.close()
  }

  const handleTimezoneChange = (e) => {
    setTimeZone(e.target.value)
  }


  const rows = Array(7).fill().map(() => [])
  for (let block of value?.timeBlocks) {
    // split blocks that span midnight and add them to the rows array
    const correctedStart = applyDstOffset(block.start)
    const correctedEnd = applyDstOffset(block.end)
    const startDay = getDay(correctedStart, { in: tz(timeZone) })
    const endDay = getDay(add(correctedEnd, {minutes: -1}), { in: tz(timeZone) })
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
