import https from 'https'
import {
  parse
} from 'url'
import {
  stringify
} from 'qs'

export default ({
  url,
  method,
  body,
  queryParams,
  headers = {}
}) => new Promise((resolve, reject) => {
  const queryString = queryParams
    ? `?${stringify(queryParams, { indices: false })}`
    : ''
  const jsonBody = body ? JSON.stringify(body) : undefined
  const parsedUrl = parse(url)
  const options = {
    hostname: parsedUrl.host,
    path: `${parsedUrl.path}${queryString}`,
    method: method || 'GET',
    headers: {
      ...headers,
      'Content-Type': headers['Content-Type'] || 'application/json'
    }
  }
  const req = https.request(options, (res) => {
    const status = res.statusCode
    res.on('data', (response) => {
      let parsed = response
      try {
        parsed = JSON.parse(parsed)
      } catch (e) {
        // response not json, leave parsed as text and continue
      }
      if (status >= 200 && status < 300) {
        resolve(parsed)
      } else {
        reject(parsed)
      }
    })
  })

  req.on('error', (e) => {
    console.warn(e)
    reject(new Error('Network Error'))
  })

  if (jsonBody) {
    req.write(jsonBody)
  }
  req.end()
})
