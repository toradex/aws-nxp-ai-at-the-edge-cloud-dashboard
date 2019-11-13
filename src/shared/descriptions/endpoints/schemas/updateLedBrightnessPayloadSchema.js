export default {
  type: 'object',
  properties: {
    deviceId: {
      type: 'string'
    },
    ledBrightness: {
      type: 'number',
    },
  },
  required: ['deviceId', 'ledBrightness'],
}
