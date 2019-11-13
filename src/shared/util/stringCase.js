import replace from 'ramda/src/replace'
import toUpper from 'ramda/src/toUpper'

export const capitalize = replace(/^./, toUpper)

export const camelCase = str => str.replace(
  /[-_ ]([a-z])/g,
  m => m[1].toUpperCase()
)

export const kebabCase = str => str.replace(
  /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g,
  m => `-${m.toLowerCase()}`
)
