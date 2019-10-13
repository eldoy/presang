var { h } = require('../lib/presang.js')
var client = require('waveorb-client')

module.exports = async function (page) {
  return [
    h('!doctype', null, { html: true }),
    h('html', '', {}, [
      h('head', '', {}, [
        h('title', page.title),
        h('link', '', { rel: 'stylesheet', href: '/app.css', type: 'text/css' }),
        h('script', 'window.q = ' + q.toString()),
        h('script', `!function(){var f=function(t){t=(t||"").trim().toLowerCase();var i=[],n=[];return{setAttribute:function(t,n){i.push(!0===n?t:t+'="'+n+'"')},appendChild:function(t){n.push(t)},toString:function(){return"<"+t+(i.length?" "+i.join(""):"")+">"+(this.textContent||"")+n.join("")+(null===this.textContent?"":"</"+t+">")}}};window.h=function(t,n,i,e){var o=f(t);for(var r in void 0!==n&&(o.textContent=n),i){i[r]&&o.setAttribute(r,i[r])}if(e)for(var u=0;u<e.length;u++)o.appendChild(e[u]);return o.toString()}}()`),
        h('script', '', { src: '/waveorb.js' }),
        h('script', 'window.api = waveorb("http://localhost:4000")')
      ]),
      h('body', '', {}, [
        h('nav', '', {}, [
          h('a', 'Home', { href: '/' }),
          h('a', 'About', { href: '/about' })
        ]),
        h('div', '', {}, await page.render())
      ])
    ])
  ].join('')
}

function q (s) {
  return document.querySelector(s)
}
