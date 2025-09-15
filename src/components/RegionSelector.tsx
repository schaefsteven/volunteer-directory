'use client'
import { useState, useEffect } from 'react'
import { useField, SelectInput, ReactSelect, FieldError, FieldLabel, fieldBaseClass } from '@payloadcms/ui'
import { allCountries } from 'country-region-data'

const countryOptions = allCountries.map((country) => ({
  'value': country[0],
  'label': country[0],
}))

const RegionSelector = ({ path }) => {
  const { value = { country: '', regions: [] }, setValue, } = useField({ path })
  
  const onCountryChange = (selectedOption) => {
    setValue(
      {
        ...value,
        country: selectedOption.value
      }
    )
  }

  console.log(value)
  return (
    <div className={fieldBaseClass}>
      <ReactSelect
        options={countryOptions}
        onChange={onCountryChange}
        value={value.country}
      />
    </div>
  )
}

export default RegionSelector
