const crypto = require('crypto')

const getAuthTokenMasterKey = (
  verb,
  resourceType,
  resourceId,
  date,
  masterKey
) => {
  const key = new Buffer(masterKey, 'base64')

  const text =
    (verb || '').toLowerCase() +
    '\n' +
    (resourceType || '').toLowerCase() +
    '\n' +
    (resourceId || '') +
    '\n' +
    date.toLowerCase() +
    '\n' +
    '' +
    '\n'

  const body = new Buffer(text, 'utf8')
  const signature = crypto
    .createHmac('sha256', key)
    .update(body)
    .digest('base64')

  const MasterToken = 'master'

  const TokenVersion = '1.0'

  return encodeURIComponent(
    `type=${MasterToken}&ver=${TokenVersion}&sig=${signature}`
  )
}

export default getAuthTokenMasterKey
