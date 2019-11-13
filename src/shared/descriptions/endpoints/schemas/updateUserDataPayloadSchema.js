export default {
  type: 'object',
  properties: {
    deviceIds: {
      type: 'string'
    },
    selectedUserId: {
      type: 'string',
    },
  },
  required: ['deviceIds', 'selectedUserId'],
}
