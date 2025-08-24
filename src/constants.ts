import { rawTimeZones } from '@vvo/tzdb'

const formatOffset = (offset) => {
  const sign = offset < 0 ? '-' : '+'
  const hours = Math.abs(Math.floor(offset / 60))
  const minutes = String(Math.abs(offset % 60)).padStart(2, '0')
  return sign + hours + ':' + minutes
}

export const TIMEZONE_LIST = rawTimeZones.sort(
  (a, b) => a.rawOffsetInMinutes - b.rawOffsetInMinutes).map(
  (tz) => ({
    'value': tz.name,
    'label': tz.alternativeName + ' (' + tz.name.replace(/_/, ' ') + ') UTC' + formatOffset(tz.rawOffsetInMinutes)
  }))
