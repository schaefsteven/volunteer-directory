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
  
  useEffect(() => {
    if (value.country) {
      const foundCountry = allCountries.find(el => el[0] === value.country)
      if (foundCountry) {
        const newRegionOptions = foundCountry[2].map(region => ({
          value: region[0],
          label: region[0],
        }))
        setRegionOptions(newRegionOptions)
      } else {
        setRegionOptions([])
      }
    } else {
      setRegionOptions([])
    }
  }, [value.country])

  const handleCountryChange = (selectedOption) => {
    if (selectedOption === null) {
      setValue({ country:'', regions: [] })
    } else {
      setValue(
        {
          country: selectedOption.value, 
          regions: [] // we don't want to keep the old regions from the old country, duh
        }
      )
    }
  }
  
  const handleRegionChange = (selectedOption) => {
    let newValue
    if (Array.isArray(selectedOption)) {
      newValue = selectedOption.map((option) => option.value)
    } else {
      newValue = []
    }

    setValue(
      {
        ...value,
        regions: newValue
      }
    )
  }

  const handleSelectAll = () => {
    if (value.country) {
      console.log(regionOptions)
      setValue({
        ...value,
        regions: regionOptions.map(el => el.value),
      })
    }
  }

  return (
    <div 
      className={[
        fieldBaseClass, 
        showError && 'error',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <FieldLabel label='' path={path} required={field.required}/>
      <SelectInput
        label="Country"
        options={countryOptions}
        onChange={handleCountryChange}
        value={value.country}
        path={path + ".country"}
        required={true}
      />
      {
        (value.country) &&
        <div>
          <SelectInput
            label="Regions"
            options={regionOptions}
            onChange={handleRegionChange}
            hasMany={true}
            value={value.regions}
            path={path + ".regions"}
            required={true}
          />
          <button
            role="button"
            type="button"
            onClick={handleSelectAll}
          >
            Select All
          </button>
        </div>
      }
    </div>
  )
}

export default RegionSelector
