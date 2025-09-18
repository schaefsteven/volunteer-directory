'use client'
import { useRowLabel } from '@payloadcms/ui'

const RegionRowLabel = () => {
  const { data, rowNumber } = useRowLabel()
  return data.region?.country ? data.region.country : `Region ${rowNumber}`
}

export default RegionRowLabel
