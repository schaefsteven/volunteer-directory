'use client'
import { useState, useEffect } from 'react'
import { useField, SelectInput, ReactSelect, FieldError, FieldLabel, fieldBaseClass } from '@payloadcms/ui'
import { allCountries } from 'country-region-data'

const countryOptions = allCountries.map((country) => ({
  value: country[0],
  label: country[0],
}))

const RegionSelector = ({ path, field }) => {
  const { value = { country: '', regions: [] }, setValue, errorMessage, showError } = useField({ path })
  const [regionOptions, setRegionOptions] = useState([])
  
  const onCountryChange = (selectedOption) => {
    setValue(
      {
        country: selectedOption.value, 
        regions: [] // we don't want to keep the old regions from the old country, duh
      }
    )
  }
  
  const onRegionChange = (selectedOption) => {
    console.log(selectedOption)
    let newValue
    if (Array.isArray(selectedOption)) {
      console.log('array')
      newValue = selectedOption.map((option) => option.value)
    } else {
      console.log('else')
      newValue = []
    }

    setValue(
      {
        ...value,
        regions: newValue
      }
    )
  }

  useEffect(() => {
    if (value.country) {
      const foundCountry = allCountries.find(el => el[0] === value.country)
      if (foundCountry) {
        const newRegionOptions = foundCountry[2].map(region => ({
          value: region,
          label: region
        }))
        setRegionOptions(newRegionOptions)
      } else {
        setRegionOptions([])
      }
    } else {
      setRegionOptions([])
    }
  }, [value.country])

  return (
    <div 
      className={[
        fieldBaseClass, 
        showError && 'error',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <FieldLabel label={field.label} path={path} required={field.required}/>
      <SelectInput
        options={countryOptions}
        onChange={onCountryChange}
        value={value.country}
        path={path + ".country"}
        required={true}
      />
      <SelectInput
        options={regionOptions}
        onChange={onRegionChange}
        hasMany={true}
        value={value.regions}
        path={path + ".regions"}
        required={true}
      />
    </div>
  )
}

export default RegionSelector
