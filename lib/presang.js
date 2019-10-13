var document = require('./document.js')

function html (name, text, atts, tags) {
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

module.exports = { h: html }
