import Ajv from 'ajv'
import ajvErrors from 'ajv-errors'
import {
  emailRe
} from 'root/src/shared/util/regexes'

const ajv = new Ajv({
  allErrors: true,
  $data: true,
  jsonPointers: true,
  errorDataPath: 'property'
})

ajv.addFormat('Email', emailRe)

ajvErrors(ajv)

export default (schemaId, schema, data) => new Promise((resolve) => {
  let validate = ajv.getSchema(schemaId)
  if (validate) {
    ajv.removeSchema(schemaId)
    ajv.addSchema({
      $async: true,
      ...schema
    }, schemaId)
    validate = ajv.getSchema(schemaId)
  } else {
    ajv.addSchema({
      $async: true,
      ...schema
    }, schemaId)
    validate = ajv.getSchema(schemaId)
  }
  validate(data).then((res) => {
    resolve({
      valid: true,
      res
    })
  }).catch((err) => {
    resolve({
      valid: false,
      errors: err.errors
    })
  })
})
