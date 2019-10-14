#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const { server } = require('../main.js')

const cmd = process.argv[2] || 'help'
const commands = { build, help, serve: server }
const root = process.cwd()
const dir = path.join(root, process.argv[3] || 'dist')

const fn = commands[cmd]
if (!fn) {
  console.log(`Unknown command: '${cmd}'`)
  process.exit(1)
}
fn()

function help () {
  console.log([
    '\nPresang commands:\n',
    'help - print this menu',
    'serve - start the server',
    'build - build a static app\n'
  ].join('\n'))
}

async function build () {
  function find (name) {
    const names = fs.readdirSync(path.join(root, name))
    const result = {}
    for (const x of names) {
      result[x.split('.')[0]] = require(path.join(root, name, x))
    }
    return result
  }
  if (fs.existsSync(dir)) {
    console.log(`Directory '${dir}' already exists, please delete it or give another name`)
    process.exit(1)
  }

  let pages
  try {
    pages = find('pages')
  } catch (e) {}

  if (!pages) {
    console.log('No pages found')
    process.exit(1)
  }

  let layouts
  try {
    layouts = find('layouts')
  } catch (e) {
    console.log(e)
    layouts = [path.join(root, 'lib', 'layout')]
  }

  fs.mkdirSync(dir)

  for (let key in pages) {
    const page = pages[key]
    const html = await layouts[page.layout || 'default'](page)
    if (html) {
      if (key === 'home') {
        key = 'index'
      }
      fs.writeFileSync(path.join(dir, `${key}.html`), html)
    }
  }
  console.log(`Files written to '${dir}'`)
}