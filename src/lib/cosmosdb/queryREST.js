import fetch from 'node-fetch'
import getToken from './getToken.js'

const queryREST = async (url, options, tokenOptions) => {
  // TODO add parameter validation

  const { verb, resourceType, resourceId, masterKey } = tokenOptions

  const reqDate = new Date().toDateString
  const token = await getToken(
    verb,
    resourceType,
    resourceId,
    reqDate,
    masterKey
  )

  const defaultHeaders = {
    'x-ms-date': reqDate,
    'x-ms-version': '2017-02-22',
    authorization: token,
    Accept: 'application/json'
  }

  const headers = Object.assign(defaultHeaders, options.headers)

  const fetchOptions = options
  fetchOptions.headers = headers

  fetch(url, fetchOptions)
    .then(response => {
      return response
    })
    .catch(err => {
      return `Error occured: ${err.message}`
    })
}
