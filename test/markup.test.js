const loader = require('conficurse')
const markup = require('../lib/markup.js')

const req = { pathname: '/', query: {} }
const res = {
  setHeader: function() {}
}

async function layout($) {
  return `
    <!doctype html>
    <html>
      <head><title>${ $.page.title }</title></head>
      <body>
        ${ $.page.content }
      </body>
    </html>`
}

const index = async function($) {
  $.page.title = 'Home'
  return `<div>Home</div>`
}

const about = async function($) {
  $.page.title = 'About'
  return `<div>About</div>`
}

const deep = async function($) {
  $.page.title = 'Deep'
  return `<div>Deep</div>`
}

const compile = async function($) {
  $.page.title = 'Compile'
  function hello() {
    return $.t('name')
  }
  return `<div>${ hello }</div>`
}

const app = {
  layouts: {
    default: layout
  },
  pages: {
    index,
    about,
    compile,
    docs: {
      deep
    }
  }
}

const t = function(key) {
  return key
}

let $

function flat(result) {
  return (result || '').split('\n').map(x => x.trim()).join('')
}

describe('markup', () => {
  beforeEach(() => {
    $ = { app, req, res, t }
    req.pathname = '/'
  })

  it('should load the home page', async () => {
    const result = await markup()($)
    expect(flat(result)).toBe(
      '<!doctype html><html><head><title>Home</title></head><body><div>Home</div></body></html>'
    )
  })

  it('should load the about page', async () => {
    req.pathname = '/about.html'
    const result = await markup()($)
    expect(flat(result)).toBe(
      '<!doctype html><html><head><title>About</title></head><body><div>About</div></body></html>'
    )
  })

  it('should not load the about page when path is wrong', async () => {
    req.pathname = '/something/about.html'
    const result = await markup()($)
    expect(result).toBeUndefined()
  })

  it('should load the deep page', async () => {
    req.pathname = '/docs/deep.html'
    const result = await markup()($)
    expect(flat(result)).toBe(
      '<!doctype html><html><head><title>Deep</title></head><body><div>Deep</div></body></html>'
    )
  })

  it('should load pages via routemap option as string', async () => {
    req.pathname = '/om-oss.html'
    $.app.config = {
      routes: {
        routemap: { '/om-oss.html': 'about' }
      }
    }
    const result = await markup()($)
    expect(flat(result)).toBe(
      '<!doctype html><html><head><title>About</title></head><body><div>About</div></body></html>'
    )
  })

  it('should load pages via routemap option as string deeply', async () => {
    req.pathname = '/hello/om-oss.html'
     $.app.config = {
      routes: {
        routemap: { '/hello/om-oss.html': 'about' }
      }
    }
    const result = await markup()($)
    expect(flat(result)).toBe(
      '<!doctype html><html><head><title>About</title></head><body><div>About</div></body></html>'
    )
  })

  it('should load pages via routemap option as string deeply alternate', async () => {
    req.pathname = '/hello/om-oss.html'
    $.app.config = {
      routes: {
        routemap: { '/hello/om-oss.html': 'docs/deep' }
      }
    }
    const result = await markup()($)
    expect(flat(result)).toBe(
      '<!doctype html><html><head><title>Deep</title></head><body><div>Deep</div></body></html>'
    )
  })

  it('should load pages via routemap option as object', async () => {
    req.pathname = '/om-oss.html'
    $.app.config = {
      routes: {
        routemap: { '/om-oss.html': { page: 'about' } }
      }
    }
    const result = await markup()($)
    expect(flat(result)).toBe(
      '<!doctype html><html><head><title>About</title></head><body><div>About</div></body></html>'
    )
  })

  it('should compile templates', async () => {
    req.pathname = '/compile.html'
    $.app.config = {
      routes: { compile: true }
    }
    const result = await markup()($)
    expect(flat(result)).toBe(
      `<!doctype html><html><head><title>Compile</title></head><body><div>function hello() {return 'name';}</div></body></html>`
    )
  })

  it('should work with dynamic routes', async () => {
    const _index = async function($) {
      return `<div>HTML</div>`
    }
    $.app = {
      pages: {
        _index
      }
    }
    const result = await markup()($)
    expect(flat(result)).toBe(`<div>HTML</div>`)
  })

  it('should collect query params from URL', async () => {
    const article = async function($) {
      return `<div>${$.req.query.year}/${$.req.query.month}</div>`
    }
    $.app = {
      pages: {
        _year: {
          _month: {
            article
          }
        }
      }
    }
    req.pathname = '/2020/12/article.html'
    const result = await markup()($)
    expect(flat(result)).toBe(`<div>2020/12</div>`)
  })

  it('should escape dynamic route if template exists', async () => {
    const _index = async function($) {
      return `<div>HTML</div>`
    }
    $.app = {
      pages: {
        about,
        _index
      }
    }
    req.pathname = '/about.html'
    const result = await markup()($)
    expect(flat(result)).toBe(`<div>About</div>`)
  })

  it('should escape dynamic route if template exists, sorted', async () => {
    const _index = async function($) {
      return `<div>HTML</div>`
    }
    $.app = {
      pages: {
        _index,
        about
      }
    }
    req.pathname = '/about.html'
    const result = await markup()($)
    expect(flat(result)).toBe(`<div>About</div>`)
  })

  it('should work with dynamic route and routemap option', async () => {
    const _index = async function($) {
      return `<div>HTML</div>`
    }
    $.app = {
      pages: {
        about,
        _index
      },
      config: {
        routes: {
          routemap: {
            '/something.html': { page: 'something' }
          }
        }
      }
    }
    req.pathname = '/om-oss.html'
    const result = await markup()($)
    expect(flat(result)).toBe(`<div>HTML</div>`)
  })

  it('should collect query params from URL with routemap option', async () => {
    const article = async function($) {
      return `<div>${$.req.query.year}/${$.req.query.month}</div>`
    }
    $.app = {
      pages: {
        _year: {
          _month: {
            article
          }
        }
      },
      config: {
        routes: {
          routemap: {
            '/_year/_month/artikkel.html': '_year/_month/article'
          }
        }
      }
    }
    req.pathname = '/2020/12/artikkel.html'
    const result = await markup()($)
    expect(flat(result)).toBe(`<div>2020/12</div>`)
  })

  it('should collect query params from URL with routemap option as object', async () => {
    const article = async function($) {
      return `<div>${$.req.query.year}/${$.req.query.month}</div>`
    }
    $.app = {
      pages: {
        _year: {
          _month: {
            article
          }
        }
      },
      config: {
        routes: {
          routemap: {
            '/_year/_month/artikkel.html': { page: '_year/_month/article' }
          }
        }
      }
    }
    req.pathname = '/2020/12/artikkel.html'
    const result = await markup()($)
    expect(flat(result)).toBe(`<div>2020/12</div>`)
  })
})
