#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const mode = process.argv[2]
const exec = require('child_process').execSync

const root = process.cwd()
const matches = [ "require('presang')", "require('../../index.js')" ]

function replaceIn (from, to) {
  from = matches[from]
  to = matches[to]

  function replace (dir) {
    fs.readdirSync(dir).forEach(function(f) {
      f = path.join(dir, f)
      if (fs.lstatSync(f).isFile()) {
        fs.writeFileSync(
          f, fs.readFileSync(f, 'utf-8').replace(from, to)
        )
      } else {
        replace(f)
      }
    })
  }
  replace(path.join(root, 'app'))
}

if (mode === 'dev') {
  exec('mv skeleton app')
  replaceIn(0, 1)
} else if (mode === 'dist') {
  replaceIn(1, 0)
  exec('mv app skeleton')
} else {
  console.log('Usage: ./scripts/setmode.js dev|dist')
}
