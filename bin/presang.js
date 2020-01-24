#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const request = require('request')
const loader = require('../lib/loader.js')
const serve = require('../lib/serve.js')
const cmd = process.argv[2] || 'help'
const commands = { create, build, help, serve }
const root = process.cwd()
const dist = path.join(root, 'dist')
const base = path.resolve(path.join(__dirname, '..'))

const fn = commands[cmd]
if (!fn) {
  console.log(`Unknown command: '${cmd}'`)
  process.exit(1)
}
fn()

function help() {
  console.log([
    '\nPresang commands:\n',
    'create - create a minimal app',
    'serve  - start the server',
    'build  - build a static app',
    'help   - print this menu'
  ].join('\n'))
}

function mkdir(to) {
  try {
    fs.mkdirSync(to, { recursive: true })
  } catch (e) {}
}

function copyFolderSync(from, to) {
  mkdir(to)
  fs.readdirSync(from).forEach(function(item) {
    const [f, t] = [path.join(from, item), path.join(to, item)]
    fs.lstatSync(f).isFile() ? fs.copyFileSync(f, t) : copyFolderSync(f, t)
  })
}

function create() {
  copyFolderSync(path.join(base, 'app'), path.join(root, 'app'))
}

async function build() {
  function read(name) {
    return fs.readdirSync(path.join(root, name))
  }

  function find(name) {
    const names = read(name)
    const result = {}
    for (const x of names) {
      result[x.split('.')[0]] = require(path.join(root, name, x))
    }
    return result
  }

  function tree(dir) {
    return fs.readdirSync(dir).reduce(function(files, file) {
      const name = path.join(dir, file)
      const list = fs.statSync(name).isDirectory() ? tree(name) : name
      return files.concat(list)
    }, [])
  }

  if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist)
  }

  const buildFile = process.argv[3] || 'build.js'
  let builder
  try {
    builder = await require(path.join(root, buildFile))()
  } catch (e) {
    console.log(`Can not build using file '${buildFile}'`)
    process.exit(1)
  }

  for (const url of builder.urls) {
    let name = url
    if (name.endsWith('/')) {
      name += 'index.html'
    }
    const dir = path.dirname(name)
    const file = path.basename(name)
    mkdir(path.join(dist, dir))
    const stream = fs.createWriteStream(path.join(dist, dir, file))
    const address = `${builder.host}${url}`
    try {
      request.get({
        url: address,
        gzip: true,
        headers: { 'x-waveorb': 'build' }
      }).pipe(stream)
    } catch(e) {
      console.log(`Can't connect to ${address}`)
    }
  }

  // Build assets
  const app = await loader()
  const assets = app.config.assets
  if (assets) {
    Object.keys(assets).forEach(function(type) {
      console.log(`Building ${type} files...`)
      const files = assets[type] || []
      const bundle = files.map(function(file) {
        const inpath = path.join(root, 'app', 'assets', file)
        return fs.readFileSync(inpath, 'utf-8')
      }).join(type === 'js' ? ';' : '\n')
      const outpath = path.join(dist, `bundle.${type}`)
      fs.writeFileSync(outpath, bundle)
    })
  }

  // Copy assets
  copyFolderSync('app/assets', 'dist')

  console.log(`Files written to '${dist}'`)
}
