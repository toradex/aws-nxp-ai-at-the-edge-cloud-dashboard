import reduce from 'ramda/src/reduce'
import path from 'ramda/src/path'
import replace from 'ramda/src/replace'
import prop from 'ramda/src/prop'
import compose from 'ramda/src/compose'
import split from 'ramda/src/split'
import set from 'ramda/src/set'
import lensPath from 'ramda/src/lensPath'
import tail from 'ramda/src/tail'
import last from 'ramda/src/last'
import join from 'ramda/src/join'

import { capitalize } from 'root/src/shared/util/stringCase'

const dataPathKey = compose(
  tail,
  split('/'),
  prop('dataPath')
)
const typePath = path(['params', 'type'])
// const schemaPathKey = compose(
// 	replace(/#\/properties\/(.*?)\/.*/, '$1'),
// 	prop('schemaPath'),
// )
const errorLimit = path(['params', 'limit'])

const getConstant = (schema, key) => compose(
  replace('1/', ''),
  path(['properties', key, 'const', '$data'])
)(schema)

const propTitle = errorPath => capitalize(last(errorPath))

export default (schema, errors) => reduce((result, error) => {
  switch (error.keyword) {
    case 'errorMessage': {
      const errorPath = dataPathKey(error)
      return set(
        lensPath(errorPath),
        error.message,
        result
      )
    }
    case 'type': {
      const errorPath = dataPathKey(error)
      return set(
        lensPath(errorPath),
        `${propTitle(errorPath)} should be a ${typePath(error)}`,
        result
      )
    }
    case 'const': {
      const errorPath = dataPathKey(error)
      return set(
        lensPath(errorPath),
        // Will prob eventually have to fix getConstant to follow paths
        `Must equal ${capitalize(getConstant(schema, last(errorPath)))}`,
        result
      )
    }
    case 'minimum': {
      const errorPath = dataPathKey(error)
      return set(
        lensPath(errorPath),
        `${propTitle(errorPath)} must be at least ${errorLimit(error)}`,
        result
      )
    }
    case 'required': {
      const errorPath = dataPathKey(error)
      return set(
        lensPath(errorPath),
        `${propTitle(errorPath)} is required`,
        result
      )
    }
    case 'minLength': {
      const errorPath = dataPathKey(error)
      return set(
        lensPath(errorPath),
        `${propTitle(errorPath)} must be at least ${errorLimit(error)} characters`,
        result
      )
    }
    case 'minItems': {
      const errorPath = dataPathKey(error)
      return set(
        lensPath(errorPath),
        `${propTitle(errorPath)} must be at least ${errorLimit(error)} items`,
        result
      )
    }
    case 'maxItems': {
      const errorPath = dataPathKey(error)
      return set(
        lensPath(errorPath),
        `${propTitle(errorPath)} must be at most ${errorLimit(error)} items`,
        result
      )
    }
    case 'format': {
      const errorPath = dataPathKey(error)
      return set(
        lensPath(errorPath),
        `Invalid ${error.params.format}`,
        result
      )
    }
    case 'pattern': {
      const errorPath = dataPathKey(error)
      const containsString = join(
        ', ',
        split('|', replace(/[()]/g, '', error.params.pattern))
      )
      return set(
        lensPath(errorPath),
        `Must contain ${containsString}`,
        result
      )
    }
    default: {
      const errorPath = dataPathKey(error)
      return set(
        lensPath(errorPath),
        JSON.stringify(error),
        result
      )
    }
  }
}, {}, errors)
