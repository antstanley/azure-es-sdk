import fetch from 'node-fetch'

const setMSI = async () => {
  if (!process.env['MSI_ENDPOINT']) {
    throw new Error(
      'MSI_ENDPOINT environment variable not set. Please ensure you are running this within an Azure Function and MSI is enabled'
    )
  }
  if (!process.env['MSI_SECRET']) {
    throw new Error(
      'MSI_SECRET environment variable not set. Please ensure you are running this within an Azure Function and MSI is enabled'
    )
  }

  const msi = {
    endpoint: process.env['MSI_ENDPOINT'],
    secret: process.env['MSI_SECRET']
  }

  return msi
}

const getADtoken = async () => {
  const apiVersion = '2017-09-01'
  const resourceID = 'https://vault.azure.net'

  const { endpoint, secret } = await setMSI()

  const url = `${endpoint}/?resource=${encodeURIComponent(resourceID)}&api-version=${encodeURIComponent(apiVersion)}`

  const options = {
    headers: {
      Secret: secret,
      Metadata: true
    },
    json: true
  }

  fetch(url, options)
    .then(response => {
      if (response.statusCode != 200) {
        throw new Error(
          'Azure AD Token request responded with ' + response.statusCode
        )
      }
      if (!response.body) throw new Error('Response returned with no body')
      if (!response.body.access_token) {
        throw new Error('No access token returned')
      }

      return response.body.access_token
    })
    .catch(err => {
      throw new Error('Unable to get Azure AD Access token with error: ' + err)
    })
}

export default getADtoken()
