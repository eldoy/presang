module.exports = {
  createElement: function (name) {
    name = (name || '').trim().toLowerCase()
    var atts = []
    var children = []
    return {
      setAttribute: function (key, value) {
        atts.push(value === true ? key : key + '="' + value + '"')
      },
      appendChild: function (tag) {
        children.push(tag)
      },
      toString: function () {
        return '<'
          + name
          + (atts.length ? ' ' + atts.join('') : '')
          + '>'
          + (this.textContent || '')
          + children.join('')
          + (
            this.textContent === null
            ? ''
            : '</' + name + '>'
          )
      }
    }
  }
}
