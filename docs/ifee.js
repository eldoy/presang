(function() {
  var document = {
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
            + (atts.length ? ' ' + atts.join(' ') : '')
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

  window.h = function (name, text, atts, tags) {
    var el = document.createElement(name)
    if(typeof text !== 'undefined'){
      el.textContent = text
    }
    for(var key in atts){
      var value = atts[key]
      if (value) {
        el.setAttribute(key, atts[key])
      }
    }
    if(tags) {
      for(var i = 0; i < tags.length; i++) {
        el.appendChild(tags[i])
      }
    }
    return el.toString()
  }
}())
