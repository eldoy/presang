const { h } = require('presang')

module.exports = {
  layout: 'default',
  title: 'home',
  render: async function ($) {
    const name = $.req.cookie('name') || ''
    return [
      h('h1', name ? 'hello: ' + name : 'hello'),
      h('p', 'this is your shiny new blazing fast ', {}, [
        h('a', 'presang app!', { target: '_blank', href: 'https://github.com/fugroup/presang' })
      ]),
      h('div', '', {}, [
        h('label', 'What is your name?', { for: 'name' }),
        h('input', null, {
          id: 'name',
          type: 'text',
          value: name,
          onkeyup: 'update(this)'
        })
      ]),
      h('script', function update(el) {
        if (el.value) {
          if (el.value === 'about') {
            cookie('name', '', -1)
            const hello = cookie('name')
            location = '/about.html?status=redirected'
          } else {
            q('h1').textContent = 'hello: ' + el.value
            cookie('name', el.value)
          }
        } else {
          q('h1').textContent = 'hello'
          cookie('name', '', -1)
        }
      })
    ]
  }
}
