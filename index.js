#!/usr/bin/env node

'use strict'

const Bossy = require('bossy')
const sync = require('./sync')

function _(str) {
  return `\u001b[4m${str}\u001b[24m`
}

let definition = {
  h: {
    description: 'Show help',
    alias: 'help',
    type: 'boolean'
  },
  b: {
    description: 'S3 bucket to sync with',
    alias: 'bucket'
  },
  p: {
    description: 'Directory path, defaults to cwd',
    alias: 'path',
    default: process.cwd()
  },
  t: {
    description: 'Sync again every n seconds',
    alias: 'watch',
    type: 'number',
    default: 0
  },
  f: {
    description: 'File filter pattern',
    alias: 'filefilter',
    multiple: true
  },
  d: {
    description: 'Directories to ignore',
    alias: 'dirfilter',
    multiple: true
  },
  c: {
    description: 'Concurrency',
    alias: 'concurrency',
    type: 'number',
    default: 4
  }
}

let args = Bossy.parse(definition)

if (args instanceof Error) {
  console.error(args.message)
  return
}

if (args.h) {
  console.log(Bossy.usage(definition, `\n  s3sync -b ${_('bucket')} [-p ${_('path')}] [-f ${_('pattern')}] [-d ${_('pattern')}] [-t ${_('n')}] [-c ${_('n')}]`))
  return
}

function restartSync() {
  if (args.t > 0) {
    setTimeout(startSync, args.t * 1000)
  }
}

function startSync() {

  sync(args.b, args.p, args.f, args.d, args.c)
    .then(() => {
      console.log('\nSync completed successfully')
      restartSync()
    })
    .catch(err => {
      console.error(err)
      restartSync()
    })
}

startSync()
