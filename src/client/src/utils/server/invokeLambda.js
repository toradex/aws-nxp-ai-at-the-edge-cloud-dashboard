import prop from 'ramda/src/prop'
import {
  region
} from '@root/cfOutput'

import Lambda from 'aws-sdk/clients/lambda'

export default (fnName, payload) => {
  // eslint-disable-next-line no-undef
  const lambda = new Lambda({
    region
  })
  return lambda.invoke({
      FunctionName: fnName.replace(/:[0-9]*$/, ''),
      Payload: JSON.stringify(payload),
    }).promise()
    .then(res => JSON.parse(prop('Payload', res)))
}
