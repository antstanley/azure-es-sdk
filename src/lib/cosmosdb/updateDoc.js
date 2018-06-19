const DocumentClient = require('documentdb').DocumentClient

import { merge } from 'lodash/merge'

function updateDoc (updatePayload, callback) {
  let docId = updatePayload.id

  let documentURI = collectionLink + 'docs/' + docId

  client.readDocument(documentURI, (err, result) => {
    if (err) {
      console.log('Unable to read document')
      callback(err)
    } else {
      let returnPayload = mergeJSON(result, updatePayload)

      client.replaceDocument(documentURI, returnPayload, function (
        err,
        document
      ) {
        if (err) {
          console.log(err)
          callback(err)
        } else {
          console.log('Updated ' + document.id)
          callback(null, document.id)
        }
      })
    }
  })
}
