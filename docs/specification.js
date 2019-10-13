// HTML Node
h('p', 'text', {}, [])

// List, static
h('ul', '', {}, [
  h('li', 'Meat'),
  h('li', 'Butter'),
  h('li', 'Milk')
])

// List, dynamic
const list = ['Meat', 'Butter', 'Milk']
h('ul', '', {}, list.map(item => h('li', item)))

// Component
function foods (list) {
  return h('ul', '', {}, list.map(item => h('li', item)))
}

// Component in component
function item (name) {
  return h('li', name)
}

function items (data) {
  return data.map(name => item(name))
}

function list () {
  return h('ul', '', {}, items())
}
