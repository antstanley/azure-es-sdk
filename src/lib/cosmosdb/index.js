import _insertDoc from './insertDoc'
import _queryDoc from './queryDoc'
import _readDoc from './readDoc'
import _replaceDoc from './replaceDoc'
import _updateDoc from './updateDoc'
import queryREST from './queryREST'

class cosmosDB {
  constructor (cdbConfig) {
    Object.assign(this, cdbConfig)
    this.endpoint = `https://${this.hostname}:443`
    this.databaseLink = `dbs/${this.database}/`
    this.collectionLink = `dbs/${this.database}/colls/${this.collection}/`
  }

  async insertDoc (payload, insertOptions) {
    const url = `${this.endpoint}/${this.collectionLink}`
    const tokenOptions = {
      verb: request.method,
      resourceType: 'docs',
      resourceId: url,
      masterKey: this.masterKey
    }
    const request = await _insertDoc(payload, insertOptions, tokenOptions)
    return queryREST(url, request)
  }

  async insertDocBulk (payload, insertOptions) {
    const url = `${this.endpoint}/${this.collectionLink}`
    const tokenOptions = {
      verb: request.method,
      resourceType: 'docs',
      resourceId: url,
      masterKey: this.masterKey
    }

    const responseArray = await payloadLen.map(async element => {
      const request = await _insertDoc(element, updateOptions, tokenOptions)
      return queryREST(url, request)
    })

    return responseArray
  }

  async updateDoc (payload, updateOptions) {
    const url = `${this.endpoint}/${this.collectionLink}`
    const tokenOptions = {
      verb: request.method,
      resourceType: 'docs',
      resourceId: url,
      masterKey: this.masterKey
    }
    const request = await _updateDoc(payload, updateOptions, tokenOptions)
    return queryREST(url, request)
  }

  async updateDocBulk (payload, updateOptions) {
    const url = `${this.endpoint}/${this.collectionLink}`

    const responseArray = await payloadLen.map(async element => {
      const tokenOptions = {
        verb: request.method,
        resourceType: 'docs',
        resourceId: `url${docId}/`,
        masterKey: this.masterKey
      }
      const request = await _updateDoc(element, updateOptions, tokenOptions)
      return queryREST(url, request)
    })

    return responseArray
  }

  async readDoc (docId, updateOptions) {
    const url = `${this.endpoint}/${this.collectionLink}`
    const tokenOptions = {
      verb: request.method,
      resourceType: 'docs',
      resourceId: url,
      masterKey: this.masterKey
    }
    const request = await _readDoc(docId, updateOptions, tokenOptions)
    return queryREST(url, request)
  }

  async readDocBulk (payload, updateOptions) {
    const url = `${this.endpoint}/${this.collectionLink}`

    const responseArray = await payloadLen.map(async element => {
      const { docId } = element
      const tokenOptions = {
        verb: request.method,
        resourceType: 'docs',
        resourceId: `url${docId}/`,
        masterKey: this.masterKey
      }
      const request = await _readDoc(element, updateOptions, tokenOptions)
      return queryREST(url, request)
    })

    return responseArray
  }

  async queryDoc (query, queryOptions) {
    const url = `${this.endpoint}/${this.collectionLink}`
    const tokenOptions = {
      verb: request.method,
      resourceType: 'docs',
      resourceId: url,
      masterKey: this.masterKey
    }
    const request = await _queryDoc(query, queryOptions, tokenOptions)
    return queryREST(url, request)
  }
}

export default cosmosDB
