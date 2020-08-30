module.exports = async function middleware($) {
  for (const key in $.app.middleware || {}) {
    const mw = $.app.middleware[key]
    if (typeof mw === 'function') {
      const result = await mw($)
      if (result) return result
    }
  }
}
