const tools = require('../lib/tools.js')

describe('tools', () => {
  it('should format a string', async () => {
    let result = tools.format('hello')
    expect(result).toBe('hello')

    result = tools.format('hello', 5)
    expect(result).toBe('hello')

    result = tools.format('hello %s', 5)
    expect(result).toBe('hello 5')

    result = tools.format('hello %s %s', 5)
    expect(result).toBe('hello 5 %s')

    result = tools.format('hello %s %s', 5, 'hello')
    expect(result).toBe('hello 5 hello')

    result = tools.format('hello %s', [1, 2, 3])
    expect(result).toBe('hello 1, 2, 3')

    result = tools.format('hello %s', { name: 'hello', key: 'a' })
    expect(result).toBe('hello name: hello, key: a')

    result = tools.format('hello %s', false)
    expect(result).toBe('hello false')

    result = tools.format('hello %s', true)
    expect(result).toBe('hello true')
  })
})
