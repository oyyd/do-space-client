const http = require('http')
const https = require('https')
const AWS = require('aws-sdk')

// NOTE: object structure
// const params = {
//   Body: 'The contents of the file',
//   Bucket: 'test_bucket',
//   Key: 'file.ext',
// }

// eslint-disable-next-line
function mySSLAgent() {
  const httpAgent = new http.Agent()
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false, // changed to false, different from the default one
  })

  return [httpAgent, httpsAgent]
}

function promisify(func) {
  return new Promise((resolve, reject) => {
    func((err, data) => {
      if (err) {
        reject(err)
        return
      }

      resolve(data)
    })
  })
}

class DoSpace {
  constructor(opt) {
    const { endpoint, accessKeyId, secretAccessKey } = opt

    this.spacesEndpoint = new AWS.Endpoint(endpoint)

    this.s3 = new AWS.S3({
      // httpOptions: {
      //   agent: new https.Agent({
      //     rejectUnauthorized: false, // changed to false, different from the default one
      //   }),
      // },
      endpoint: this.spacesEndpoint,
      accessKeyId,
      secretAccessKey,
    })
  }

  putObject(params) {
    return promisify(next => this.s3.putObject(params, next))
  }

  getObject(params) {
    return promisify(next => this.s3.getObject(params, next))
  }

  getObjectStreamByKey(bucket, key) {
    return this.s3
      .getObject({
        Bucket: bucket,
        Key: key,
      })
      .createReadStream()
  }

  listBuckets(params = {}) {
    return promisify(next => this.s3.listBuckets(params, next))
  }

  listObjects(params = {}) {
    return promisify(next => this.s3.listObjectsV2(params, next))
  }
}

module.exports = {
  DoSpace,
}

if (module === require.main) {
  const info = require('./__info')

  const doSpace = new DoSpace(info)

  // doSpace
  //   .listObjects({
  //     Prefix: 'original/2018',
  //   })
  //   .then(res => {
  //     console.log('res', res)
  //   })
  //   .catch(err => {
  //     console.error(err)
  //   })

  doSpace.listBuckets({}).then(res => {
    console.log('res', res)
  })
}
