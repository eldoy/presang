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

  it('should should transform a string', async () => {
    let params = { hello: 'something' }
    tools.transform(params)
    expect(params.hello).toBe('something')

    params = { hello: 'Hello! 2' }
    tools.transform(params)
    expect(params.hello).toBe('Hello! 2')

    params = { hello: '2020-11-02T08:22:31.017Z' }
    tools.transform(params)
    expect(typeof params.hello.getMonth).toBe('function')

    params = { hello: '2020-11-02T08:22:31Z' }
    tools.transform(params)
    expect(typeof params.hello.getMonth).toBe('function')
  })

  it('should md5 hash a string', async () => {
    let result = tools.md5('hello')
    expect(result).toBe('5d41402abc4b2a76b9719d911017c592')
  })

  it('should generate a uuid', async () => {
    let result = tools.uuid()
    expect(typeof result).toBe('string')
    expect(result.length).toBe(36)
  })
})
