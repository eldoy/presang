const fs = require('fs')
const path = require('path')
const loader = require('../lib/loader.js')

describe('loader', () => {
  beforeEach(() => {
    delete process.env.WAVEORB_APP
  })

  it('should load an application', async () => {
    const app = await loader()
    expect(typeof app).toBe('object')
  })

  it('should load an application from process env', async () => {
    process.env.WAVEORB_APP = 'test/apps/app1'
    const app = await loader()
    expect(typeof app).toBe('object')
    expect(app.config.env.hello).toBe('bye')
  })

  it('should build scss files', async () => {
    let file = path.join(process.cwd(), 'app', 'assets', 'css', 'base.css')
    try {
      fs.unlinkSync(file)
    } catch(e){}
    await loader()
    const css = fs.readFileSync(file)
    expect(css.length).toEqual(47)
  })
})
