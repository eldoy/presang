const helpers = require('../lib/helpers.js')
let tags

describe('js', () => {
  beforeEach(() => {
    tags = helpers()
  })
  it('should create a js tag', async () => {
    const tag = tags.js('app.js')
    expect(tag).toBe('<script src="app.js"></script>')
  })

  it('should create multiple js tags', async () => {
    const tag = tags.js('app.js', 'hello.js')
    expect(tag).toBe('<script src="app.js"></script><script src="hello.js"></script>')
  })

  it('should expand bundle files', async () => {
    const app = {
      config: {
        assets: {
          js: ['app.js']
        }
      }
    }
    tags = helpers(app.config.assets)
    const tag = tags.js('bundle.js')
    expect(tag).toBe('<script src="app.js"></script>')
  })

  it('should not expand bundle files', async () => {
    const app = {
      config: {
        assets: {
          js: ['app.js']
        }
      }
    }
    tags = helpers(app.config.assets, { bundle: true })
    const tag = tags.js('bundle.js')
    expect(tag).toBe('<script src="bundle.js"></script>')
  })
})

describe('css', () => {
  it('should create a css tag', async () => {
    const tag = tags.css('app.css')
    expect(tag).toBe('<link href="app.css" rel="stylesheet" type="text/css">')
  })

  it('should create multiple css tags', async () => {
    const tag = tags.css('app.css', 'hello.css')
    expect(tag).toBe('<link href="app.css" rel="stylesheet" type="text/css"><link href="hello.css" rel="stylesheet" type="text/css">')
  })

  it('should expand bundle files', async () => {
    const app = {
      config: {
        assets: {
          css: ['app.css']
        }
      }
    }
    tags = helpers(app.config.assets)
    const tag = tags.css('bundle.css')
    expect(tag).toBe('<link href="app.css" rel="stylesheet" type="text/css">')
  })

  it('should not expand bundle files', async () => {
    const app = {
      config: {
        assets: {
          css: ['app.css']
        }
      }
    }
    tags = helpers(app.config.assets, { bundle: true })
    const tag = tags.css('bundle.css')
    expect(tag).toBe('<link href="bundle.css" rel="stylesheet" type="text/css">')
  })
})
