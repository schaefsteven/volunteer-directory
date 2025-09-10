'use client'
import { useState, useEffect } from 'react'
import { useField, SelectField, FieldError, FieldLabel, fieldBaseClass } from '@payloadcms/ui'
import { allCountries } from 'country-region-data'

const countryOptions = allCountries.map((country) => ({
  'value': country[0],
  'label': country[0],
}))

const RegionSelector = (props) => {
  const { value = { country: '', regions: [] }, setValue } = useField(props.path)
  console.log(value)
  const [ selectedCountry, setSelectedCountry ] = useState(value.country)
  const [ selectedRegions, setSelectedRegions ] = useState(value.regions)

  console.log(selectedCountry)
  console.log(selectedRegions)
  return (
    <div className={fieldBaseClass}>
      <SelectField 
        field={{
          name: "Country",
          options: countryOptions,
        }}
        path={props.path + ".country"}
      />
    </div>
  )
}

export default RegionSelector
