# Presang
Isomorphic server side rendered (SSR) HTML written in pure vanilla Javascript.

Includes a minimal server. Layouts and pages are loaded into memory on startup for that blazing speed. Web pack is not used, and package size is incredibly small at only 0.6Kb uncompressed!

You can completely control what gets included on the server and what gets loaded after the page is served in the browser without any magic.

Have a look at the [Presang demo](https://github.com/fugroup/presang-demo) for a full example with code.

### Install
```
// Install the library globally
npm i -g presang

// Go to your presang app directory and start the server
presang
```
Open http://localhost:5000 in your browser when the server is running.

### App structure
`layouts` - contains your layouts
`pages` - contains your pages
`assets` - contains your external javascript and css

Layouts and pages are javascript files that must export an async function that returns a string of HTML.

### Usage
Build HTML using the `h` function, it works both on the server and in the browser. Use the `q` function for selecting HTML elements, that only works in the browser.

```javascript
var { h } = require('../lib/presang.js')
var waveorb = require('waveorb-client')
var api = waveorb('http://localhost:4000')

module.exports = {
  layout: 'default',
  title: 'Home page',
  render: async function () {
    return [
      h('h1', 'Hello'),
      h('label', 'Add a new project', { for: 'create' }),
      h('br'),
      h('div', '', { id: 'errors' }),
      h('input', '', { id: 'create', type: 'text' }),
      h('button', 'Add', { onclick: 'createProject()' }),
      h('div', '', { id: 'fields' }),
      h('div', 'Loading...', { id: 'list' }),
      h('script', [
        'var projects = null',
        renderProjectList.toString(),
        createProject.toString(),
        'renderProjectList()'
      ].join(';\n'))
    ]
  }
}

async function renderProjectList () {
  if (!projects) {
    projects = await api.fetch({ path: 'listProjects' })
  }
  q('#list').innerHTML = h(
    'div',
    projects.length ? '' : 'No projects found',
    {},
    projects.map(x => h('div', x.name))
  )
}

async function createProject () {
  var projectName = q('input').value
  q('#errors').textContent = ''
  q('#fields').textContent = ''
  var result = await api.fetch({
    path: 'createProject',
    data: {
      values: {
        name: projectName
      }
    }
  })
  if (result.errors) {
    q('#errors').textContent = result.errors.message
    q('#fields').textContent = result.errors.values.name
  } else {
    q('input').value = ''
    projects.unshift(result)
    renderProjectList()
  }
}
```
MIT Licensed. Enjoy!