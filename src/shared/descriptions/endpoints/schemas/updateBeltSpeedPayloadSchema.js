export default {
  type: 'object',
  properties: {
    deviceId: {
      type: 'string'
    },
    beltSpeed: {
      type: 'number',
    },
  },
  required: ['deviceId', 'beltSpeed'],
}
