const loader = require('../lib/loader.js')
const dispatch = require('../lib/dispatch.js')

describe('dispatch', () => {
  beforeEach(() => {
    delete process.env.WAVEORB_APP
  })

  it('should run middleware', async () => {
    process.env.WAVEORB_APP = 'test/apps/app4'
    const app = await loader()
    const $ = { app }
    const result = await dispatch($, async function(){})
    expect(typeof result).toBe('object')
    expect(result.hello).toBe('middleware')
  })
})
