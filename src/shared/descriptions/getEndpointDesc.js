import path from 'ramda/src/path'
import {
  prop
} from 'ramda'
import clientEndpoints from 'root/src/shared/descriptions/endpoints'

export const testEndpointExists = endpointId => prop(endpointId, clientEndpoints)

export const getPayloadSchema = (endpointId) => {
  return path(
    [endpointId, 'payloadSchema'],
    clientEndpoints,
  )
}

export const getResultSchema = endpointId => path(
  [endpointId, 'resultSchema'],
  clientEndpoints,
)

export const getAuthentication = endpointId => path(
  [endpointId, 'authentication'],
  clientEndpoints,
)
