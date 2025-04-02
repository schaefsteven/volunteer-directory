"use client"

import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

import styles from './Test.module.css'
import cn from 'classnames'

const TestComponent: TextFieldClientComponent = ({path}) => {
    const { value = '', setValue } = useField({path})
    return <input onChange={(e) => setValue(e.target.value)} value={value}/>
}

export const SimpleRangeSlider = () => {
    return (
        <>
            <input
                type="range"
                min="0"
                max="100"
                className={cn(styles.thumb, styles.thumb__zindex-3)}
            />
            <input
                type="range"
                min="0"
                max="100"
                className={cn(styles.thumb, styles.thumb__zindex-4)}
            />
            <div className={styles.slider}>
                <div className={styles.slider__track} />
                <div className={styles.slider__range} />
            </div>
        </>
    )
}

export default TestComponent
