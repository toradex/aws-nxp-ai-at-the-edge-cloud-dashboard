import {
  IotData
} from 'aws-sdk'
import {
  iotEndpoint
} from 'root/src/shared/constants/aws'


export default async (topic, payload) => {
  const iotdata = new IotData({
    endpoint: iotEndpoint
  })
  const params = {
    topic,
    payload,
    qos: 0
  }

  iotdata.publish(params, function (err, data) {
    if (err) {
      Promise.resolve(err)
    } else {
      Promise.resolve(data)
    }
  })
}
