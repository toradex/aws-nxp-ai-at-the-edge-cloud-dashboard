import prop from 'ramda/src/prop'
import validateSchema from 'root/src/shared/util/validateSchema'
import {
  payloadSchemaError,
  responseSchemaError
} from 'root/src/server/api/errors'
import ajvErrors from 'root/src/shared/util/ajvErrors'

export default (schemaType, endpointId, schema) => (payload) => {
  if (schema) {
    return validateSchema(
      `${endpointId}${schemaType}`, schema, payload
    ).then((res) => {
      if (prop('valid', res)) {
        return payload
      }
      const errors = ajvErrors(schema, prop('errors', res))
      const errorType = schemaType === 'payloadSchema'
        ? payloadSchemaError(errors) : responseSchemaError(errors)
      throw errorType
    })
  }
  return Promise.resolve(payload)
}
