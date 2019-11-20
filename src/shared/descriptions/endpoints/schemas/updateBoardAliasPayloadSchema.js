export default {
  type: 'object',
  properties: {
    deviceId: {
      type: 'string'
    },
    alias: {
      type: 'string',
    },
  },
  required: ['deviceId', 'alias'],
}
