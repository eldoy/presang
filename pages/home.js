var { h } = require('../lib/presang.js')
var waveorb = require('waveorb-client')
var api = waveorb('http://localhost:4000')

module.exports = {
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
