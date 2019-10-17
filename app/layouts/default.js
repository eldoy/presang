const { h, q, qa, cookie } = require('../../index.js')

module.exports = async function ($) {
  return [
    h('!doctype', null, { html: true }),
    h('html', '', { lang: 'en' }, [
      h('head', '', {}, [
        h('meta', null, { 'http-equiv': 'content-type', content: 'text/html; charset=utf-8' }),
        h('title', $.page.title || 'Untitled'),
        h('link', null, { rel: 'stylesheet', href: '/app.css', type: 'text/css' }),
        h('script', cookie),
        h('script', h),
        h('script', q),
        h('script', qa)
      ]),
      h('body', '', {}, [
        h('div', '', {}, [
          h('nav', '', {}, [
            h('a', 'home', { href: '/' }),
            h('a', 'about', { href: '/about.html' })
          ]),
          h('main', '', {}, $.page.content)
        ]),
        h('script', function activeLink () {
          var a = q(`nav a[href='${location.pathname}']`) || q('nav a')
          a.classList.add('active-link')
        }),
        h('script', 'activeLink()')
      ])
    ])
  ].join('')
}
