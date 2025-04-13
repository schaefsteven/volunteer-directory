"use client"

import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

import styles from './Test.module.css'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { useState, useRef } from 'react'

const TestComponent: TextFieldClientComponent = ({path}) => {
    const { value = '', setValue } = useField({path})
    return <input onChange={(e) => setValue(e.target.value)} value={value}/>
}

export const SimpleRangeSlider = ({ min = 0, max = 100, onChange }) => {
    const [minVal, setMinVal] = useState(min)
    const [maxVal, setMaxVal] = useState(max)
    const minValRef = useRef(null)
    const maxValRef = useRef(null)

    return (
        <>
            <input
                type="range"
                min={min}
                max={max}
                value={minVal}
                ref={minValRef}
                onChange={(e) => {
                    const value = Math.min(+e.target.value, maxVal - 20)
                    setMinVal(value)
                    e.target.value = value.toString()
                }}
                className={cn(styles.thumb, styles['thumb__zindex-3'], { [styles['thumb__zindex-5']] : minVal > max - 100 })}
            />
            <input
                type="range"
                min={min}
                max={max}
                value={maxVal}
                ref={maxValRef}
                onChange={(e) => {
                    const value = Math.max(+e.target.value, minVal + 20)
                    setMaxVal(value)
                    e.target.value = value.toString()
                }}
                className={cn(styles.thumb, styles['thumb__zindex-4'])}
            />
            <div className={styles.slider}>
                <div className={styles.slider__track} />
                <div className={styles.slider__range} />
            </div>
        </>
    )
}

SimpleRangeSlider.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
}

export const AvailabilitySelector = () => {
  return (
    <>
      <div className={cn(styles.avsel_row)}>
        <label>SUN</label>
        <div role="button" className={cn(styles.avsel_add_button)}>
          +
        </div>
      </div>
    </>
  )
}

export default TestComponent
