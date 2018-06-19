const request = require('request')
let AzureADToken
let secret

function setMSI (callback) {
  if (!process.env['MSI_ENDPOINT']) {
    throw new Error(
      'MSI_ENDPOINT environment variable not set. Please ensure you running this within an Azure Function'
    )
  }
  if (!process.env['MSI_SECRET']) {
    throw new Error(
      'MSI_SECRET environment variable not set. Please ensure you running this within an Azure Function'
    )
  }

  let msi = {
    endpoint: process.env['MSI_ENDPOINT'],
    secret: process.env['MSI_SECRET']
  }
  callback(null, msi)
}

function getADtoken (callback) {
  const apiVersion = '2017-09-01'
  const resourceID = 'https://vault.azure.net'

  setMSI((err, response) => {
    if (response) {
      const url =
        response.endpoint +
        '/?resource=' +
        encodeURIComponent(resourceID) +
        '&api-version=' +
        encodeURIComponent(apiVersion)

      const options = {
        url: url,
        headers: {
          Secret: response.secret,
          Metadata: true
        },
        json: true
      }

      request(options, (err, response, body) => {
        if (err) {
          throw new Error(
            'Unable to get Azure AD Access token with error: ' + err
          )
        }
        if (response.statusCode != 200) {
          throw new Error(
            'Azure AD Token request responded with ' + response.statusCode
          )
        }
        if (!body) throw new Error('Response returned with no body')
        if (body.access_token) {
          callback(null, body.access_token)
        } else {
          callback('No Access Token returned')
        }
      })
    } else {
      callback('No response when fetching MSI')
    }
  })
}

function getSecret (secretURL, callback) {
  secretURLAPI = secretURL + '?api-version=2016-10-01'

  if (!AzureADToken) {
    getADtoken((err, response) => {
      if (response) {
        AzureADToken = response

        const options = {
          url: secretURLAPI,
          headers: {
            Authorization: `Bearer ${AzureADToken}`
          },
          json: true
        }

        request(options, (err, response, body) => {
          if (err) {
            callback(err)
          } else {
            if (response.statusCode != 200) {
              throw new Error(
                `Unable to retrieve secret. Responded with ${response.statusCode}`
              )
            }
            if (!body) {
              throw new Error('GET Secret Response returned with no body')
            }

            callback(null, body.value)
          }
        })
      } else {
        callback(err)
      }
    })
  } else {
    const options = {
      url: secretURLAPI,
      headers: {
        Authorization: `Bearer ${AzureADToken}`
      },
      json: true
    }

    request(options, (err, response, body) => {
      if (err) {
        callback(err)
      } else {
        if (response.statusCode != 200) {
          throw new Error(
            `Unable to retrieve secret. Responded with ${response.statusCode}`
          )
        }
        if (!body) throw new Error('GET Secret Response returned with no body')
        callback(null, body.value)
      }
    })
  }
}

function pushEvent (topicURL, topicSecret, eventPayload, callback) {
  const options = {
    method: 'POST',
    url: topicURL,
    headers: {
      'aeg-sas-key': topicSecret
    },
    json: true,
    body: [eventPayload]
  }

  request(options, (err, response, body) => {
    if (err) {
      callback(err)
    } else {
      callback(null, true)
    }
  })
}

function publishEvent (eventPayload, topicDetails, callback) {
  if (!topicDetails.topicURL) throw new Error('No topicURL specified')

  if (!secret) {
    getSecret(topicDetails.secretURL, (err, response) => {
      if (response) {
        secret = response
        pushEvent(
          topicDetails.topicURL,
          secret,
          eventPayload,
          (err, response) => {
            if (response) {
              callback(null, response)
            } else {
              callback(err)
            }
          }
        )
      } else {
        callback(err)
      }
    })
  } else {
    pushEvent(topicDetails.topicURL, secret, eventPayload, (err, response) => {
      if (response) {
        callback(null, response)
      } else {
        callback(err)
      }
    })
  }
}

module.exports = {
  publishEvent: publishEvent
}
