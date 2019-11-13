import pick from 'ramda/src/pick'
import path from 'ramda/src/path'

import validateOrNah from 'root/src/server/util/validateOrNah'
import {
  customError,
  endpointNotFoundError
} from 'root/src/server/api/errors'
import {
  getPayloadSchema,
  getResultSchema,
  testEndpointExists
} from 'root/src/shared/descriptions/getEndpointDesc'
import serverEndpoints from 'root/src/server/api/actions'
import authorizeRequest from 'root/src/server/api/authorizeRequest'

export const apiHof = (
  serverEndpointsObj, getPayloadSchemaFn, getResultSchemaFn,
  authorizeRequestFn, testEndpointExistsFn,
) => async (event) => {
  const {
    endpointId,
    payload,
    authentication
  } = event
  try {
    const endpointExists = testEndpointExistsFn(endpointId)

    if (!endpointExists) {
      throw endpointNotFoundError(endpointId)
    }
    const action = path([endpointId], serverEndpointsObj)
    const payloadSchema = getPayloadSchemaFn(endpointId)
    const resultSchema = getResultSchemaFn(endpointId)
    const userId = await authorizeRequestFn(endpointId, authentication)
    const validatePayload = validateOrNah(
      'payloadSchema', endpointId, payloadSchema
    )
    const validateResult = validateOrNah(
      'resultSchema', endpointId, resultSchema
    )
    await validatePayload(payload)
    const res = await action({
      userId,
      payload
    })
    await validateResult(res)

    return {
      statusCode: 200,
      body: res
    }
  } catch (error) {
    const errorMessage = error.message
    return customError(error.statusCode || 500, {
      ...(errorMessage ? {
        generalErrors: errorMessage
      } : {}),
      ...pick(['generalErrors', 'schemaErrors'], error)
    })
  }
}

export const apiFn = apiHof(
  serverEndpoints, getPayloadSchema, getResultSchema,
  authorizeRequest, testEndpointExists
)

// can't return promise?
export default (event, context, callback) => {
  apiFn(event, context, callback).then((res) => {
    callback(null, res)
  })
}
