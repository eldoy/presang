module.exports = async function dispatch($, fn) {
  try {
    return await fn($)
  } catch (e) {
    console.error('ERROR!')
    e = { error: { message: e.message, name: e.name, stack: e.stack } }
    console.log(e)
    return e
  }
}
