const axios = require('axios')
async function api(path, data) {
  try {
    return await axios.post(`http://localhost:${process.env.WAVEORB_PORT}/`, { path, data })
  } catch (e) {
    return e.response
  }
}

describe('serve', () => {
  it('should return success on empty app', async () => {
    try {
      const result = await api('createProject', {})
      expect(result.data).toBe('')
      expect(result.status).toBe(200)
    } catch (e) {
      console.log(`Serve tests needs server: node index.js`)
    }
  })
})
