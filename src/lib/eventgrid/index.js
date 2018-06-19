import fetch from 'node-fetch'

const publishEvent = (topicURL, topicSecret, eventPayload, callback) => {
  const options = {
    method: 'POST',
    headers: {
      'aeg-sas-key': topicSecret,
      'Content-Type': 'application/json'
    },
    body: [eventPayload]
  }

  fetch(topicURL, options)
    .then(response => {
      return true
    })
    .catch(err => {
      throw new err()
    })
}

export default publishEvent()
