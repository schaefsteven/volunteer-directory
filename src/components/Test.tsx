'use client'
import { useField } from '@payloadcms/ui'

const TestComponent = ({ path }) => {
  const { value, setValue } = useField({ path })
  const onChange = () => {
    setValue('hello test')
  }
  console.log(value)
  return (
    <div>
      <button 
        role="button" 
        type="button"
        onClick={onChange}
      >
        test
      </button>
      {value}
    </div>
  )
}

export default TestComponent
