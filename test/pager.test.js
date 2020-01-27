const pager = require('../lib/pager.js')
const loader = require('../lib/loader.js')

describe('pager', () => {
  afterEach(() => {
    delete process.env.WAVEORB_APP
  })

  it('should find a page', async () => {
    process.env.WAVEORB_APP = 'test/apps/app2'
    const app = await loader()
    const $ = { app }
    let page = pager('about', $)
    expect(page).toBeDefined()
    page = pager('index', $)
    expect(page).toBeDefined()
    page = pager('notfound', $)
    expect(page).toBeUndefined()
  })
})