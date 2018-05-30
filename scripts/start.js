#!/usr/bin/env node

const path = require('path')
const { spawn } = require('child_process')

function main() {
  const root = path.resolve(__dirname, '../')
  const version = 'v' + require('../package.json').engines.yode
  const yode = path.resolve(
    root,
    'yode',
    `yode-${version}-${process.platform}-${process.arch}`,
    process.platform === 'win32' ? 'yode.exe' : 'yode'
  )

  const child = spawn(yode, ['--expose-gc', path.resolve(root, './index.bundle.js')])
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)

  return child
}

module.exports = main

if (module === require.main) {
  main()
}
