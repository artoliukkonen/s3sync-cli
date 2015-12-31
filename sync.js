'use strict'

const level = require('level')
const s3sync = require('s3-sync')
const readdirp = require('readdirp')
const Path = require('path')

module.exports = function(bucket, dir, fileFilter, dirFilter) {
  return new Promise((resolve, reject) => {

    // To cache the S3 HEAD results and speed up the
    // upload process. Usage is optional.
    let db = level(Path.join(dir, '.s3cache'))

    let files = readdirp({
      root: dir,
      fileFilter: fileFilter,
      directoryFilter: ['!.git', '!.s3cache'].concat(dirFilter || [])
    })

    // Takes the same options arguments as `knox`,
    // plus some additional options listed above
    let uploader = s3sync(db, {
      key: process.env.AWS_ACCESS_KEY,
      secret: process.env.AWS_SECRET_KEY,
      bucket: bucket,
      concurrency: 16,
      acl: 'private'
      // prefix : 'mysubfolder/' //optional prefix to files on S3
    })

    uploader.on('data', function(file) {
      let msg = file.fresh ? file.url.replace(/^http:\/\/[^\/]+/) : 'unchanged'
      console.log(`${file.path} -> ${msg}`)
    })

    uploader.on('error', reject)

    uploader.once('end', () => {
      db.close()
      resolve()
    })

    files.pipe(uploader)
  })
}
