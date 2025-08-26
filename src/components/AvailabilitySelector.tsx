'use client' 
import { useState, useRef, useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import styles from './AvailabilitySelector.module.css'
import cn from 'classnames'
import { format, parse } from "date-fns"
import { UTCDateMini, utc } from "@date-fns/utc"

const AvailabilitySelector = ({ path }) => {

  // set up states etc
  const { value, setValue } = useField({ path })
  const [editContext, setEditContext] = useState(null)
  const editModalRef = useRef(null)

  // HELPERS
  const createTime = (day, hour = 0, minute = 0) => {
    // returns minutes of the week from day, hour, minute
    return (day * 1440) + (hour * 60) + minute
  }

  const uiTimeFormat = (minutesOfWeek) => {
    // converts minutes of the week to a 12-hour time
    const minutesOfDay = minutesOfWeek % 1440
    return format(new UTCDateMini(1970, 0, 1, 0, minutesOfDay, 0), 'h:mm aaa', {in: utc})
  }

  const areBlocksOverlapping = (block1, block2) => {
    return (block1.start <= block2.end && block1.end >= block2.start)
  }

  const parseTime = (string, endMode = false) => {
    // parses user input into minutes of day
    const ogString = string
    const formats = [
      'HH',        // 0
      'kk',        // 1-24
      'HHmm',      // 0115
      'hhaaaaa',   // 01p
      'hhmmaaaaa', // 0115p
    ]

    // keep only numbers and a p
    string = string.replace(/[^0-9apAP]/g, '')
    string = string.toLowerCase()
    // check how many digits we have. If it's 3, pad to 4,
    if (string.replace(/[^0-9]/g, '').length == 3) {
      string = '0' + string
    }
    const refDate = new UTCDateMini(1970)
    for (const fmt of formats) {
      try {
        const date = parse(string, fmt, refDate)
        if (!isNaN(date)) {
          const hours = parseInt(format(date, 'H', {in: utc}))
          const minutes = parseInt(format(date, 'm', {in: utc}))
          if (endMode) {
            // if we're parsing an 'end' time, midnight should be 24 not 0
            if (hours + minutes === 0) {
              return 24 * 60
            }
          }
          return (hours*60) + minutes
        }
      } catch (e) {}
    }
    return null
  }

  const rowsToValue = (rows) => {
    // converts the 'rows' structure into the 'value' structure
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
    return merged
  }

  // HANDLERS
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
    // only setValue if we're editing
    if (editContext.mode === 'edit') {
      const newRows = [...rows]
      newRows[day].splice(index, 1)
      setValue(rowsToValue(newRows))
    }
    editModalRef.current.close()
  }

  const handleCancelButton = () => {
    editModalRef.current.close()
  }
 
  const handleSaveButton = (start, end) => {
    // keep the rows structure so we can use the editContext
    const newRows = [...rows]
    const startInput = parseTime(start)
    const endInput = parseTime(end, true)
    // check if we parsed the inputs
    if (startInput == null || endInput == null) {
      return 'Could not parse time.'
    }
    // check if interval is positive
    start = createTime(editContext.day, 0, startInput)
    end = createTime(editContext.day, 0, endInput)
    if (startInput > endInput) {
      return 'Start time must be before end time.'
    }
    const newBlock = {
      'start': start,
      'end': end
    }
    if (editContext.mode == 'edit') {
      newRows[editContext.day][editContext.index] = newBlock
    } else {
      newRows[editContext.day].push(newBlock)
    }
    setValue(rowsToValue(newRows))
    return null
  }

  const getDay = (minutesOfWeek) => Math.floor(minutesOfWeek / 1440)

  const rows = Array(7).fill().map(() => [])
  for (let block of value) {
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
      <div className={cn(styles.avsel_rows_container)}>
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
      </div>
      <EditModal
        handleDeleteButton={handleDeleteButton}
        handleCancelButton={handleCancelButton}
        handleSaveButton={handleSaveButton}
        editContext={editContext}
        editModalRef={editModalRef}
        uiTimeFormat={uiTimeFormat}
      />
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
      <button 
        type="button"
        onClick={() => handleEditButton(day, index)}
      >
        edit
      </button>
    </div>
  )
}

const EditModal = ({ handleDeleteButton, handleCancelButton, handleSaveButton, editContext, editModalRef, uiTimeFormat }) => {
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [error, setError] = useState(null)
  const startInputRef = useRef(null)

  useEffect(() => {
    if (editContext?.block) {
      setStartTime(uiTimeFormat(editContext.block.start))
      setEndTime(uiTimeFormat(editContext.block.end))
    } else {
      setStartTime('')
      setEndTime('')
    }
    setError('')
    // focus the start input when the modal opens
    startInputRef.current?.focus()
  }, [editContext])

  const handleSaveButtonWrapper = (startTime, endTime) => {
    setError('')
    const error = handleSaveButton(startTime, endTime)
    if (error) {
      setError(error)
    } else {
      editModalRef.current.close()
    }
  }

  const onEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSaveButtonWrapper(startTime, endTime)
    }
  }

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
          <div>
            <span className={cn(styles.error)}>{error}</span>
          </div>
          <main>
            <input
              type="text"
              placeholder="Start"
              value={startTime}
              onChange={(e) => {setStartTime(e.target.value); setError('')}}
              onKeyDown={onEnter}
              ref={startInputRef}
            />
            <span>-</span>
            <input
              type="text"
              placeholder="End"
              value={endTime}
              onChange={(e) => {setEndTime(e.target.value); setError('')}}
              onKeyDown={onEnter}
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
              onClick={() => handleSaveButtonWrapper(startTime, endTime)}
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
