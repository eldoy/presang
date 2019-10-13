var { h } = require('../lib/presang.js')
var waveorb = require('waveorb-client')
var api = waveorb('http://localhost:4000')

module.exports = async function () {
  var projects = await api.fetch({ path: 'listProjects' })
  return [
    h('h1', 'Hello'),
    h('label', 'Add a new project', { for: 'newproject' }),
    h('br'),
    h('input', '', { id: 'newproject', type: 'text' }),
    h('button', 'Add', { onclick: 'newproject()' }),
    h('div', '', { id: 'list' }, projectlist(projects)),
    h('script', projectlist.toString()),
    h('script', newproject.toString()),
    h('script', 'var projects = ' + JSON.stringify(projects))
  ]
}

async function newproject () {
  var projectName = $('input').value
  var result = await api.fetch({
    path: 'createProject',
    data: {
      values: {
        name: projectName
      }
    }
  })
  projects.unshift(result)
  $('#list div').innerHTML = projectlist(projects)
}

function projectlist (projects) {
  return h(
    'div',
    projects.length ? '' : 'No projects found',
    {},
    projects.map(x => h('div', x.name))
  )
}
