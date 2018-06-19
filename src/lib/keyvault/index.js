import fetch from 'node-fetch'

const getSecret = async (secretURL, azureADToken, callback) => {
  if (!azureADToken) throw new Error('No AD Token specified')

  secretURLAPI = secretURL + '?api-version=2016-10-01'

  const options = {
    headers: {
      Authorization: `Bearer ${AzureADToken}`
    },
    json: true
  }

  fetch(secrectURLAPI, options)
    .then(response => {
      if (response.statusCode != 200) {
        throw new Error(
          `Unable to retrieve secret. Responded with ${response.statusCode}`
        )
      }
      if (!response.body) {
        throw new Error('GET Secret Response returned with no body')
      }
      return response.body.value
    })
    .catch(err => {
      throw new Error(err)
    })
}

export default getSecret()
