const bundler = require('../lib/bundler.js')
let assets

describe('js', () => {
  beforeEach(() => {
    assets = bundler()
  })
  it('should create a js tag', async () => {
    const tag = assets.js('app.js')
    expect(tag).toBe('<script src="app.js"></script>')
  })

  it('should create multiple js tags', async () => {
    const tag = assets.js('app.js', 'hello.js')
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
    assets = bundler(app.config.assets)
    const tag = assets.js('bundle.js')
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
    assets = bundler(app.config.assets, { bundle: true })
    const tag = assets.js('bundle.js')
    expect(tag).toBe('<script src="bundle.js"></script>')
  })
})

describe('css', () => {
  it('should create a css tag', async () => {
    const tag = assets.css('app.css')
    expect(tag).toBe('<link href="app.css" rel="stylesheet" type="text/css">')
  })

  it('should create multiple css tags', async () => {
    const tag = assets.css('app.css', 'hello.css')
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
    assets = bundler(app.config.assets)
    const tag = assets.css('bundle.css')
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
    assets = bundler(app.config.assets, { bundle: true })
    const tag = assets.css('bundle.css')
    expect(tag).toBe('<link href="bundle.css" rel="stylesheet" type="text/css">')
  })
})
