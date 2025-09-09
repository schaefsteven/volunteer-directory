'use client'
import { useState, useEffect } from 'react'
import { useField, SelectField, FieldError, FieldLabel, fieldBaseClass } from '@payloadcms/ui'
import { allCountries } from 'country-region-data'

const RegionSelector = (props) => {
  const countryOptions = allCountries.map((country) => ({
    'value': country[0],
    'label': country[0],
  }))
  console.log(countryOptions)
  return (
    <div className={fieldBaseClass}>
      <SelectField 
        {...props}
        field={{
          ...props.field,
          options: countryOptions
        }}
      />
    </div>
  )
}

export default RegionSelector
