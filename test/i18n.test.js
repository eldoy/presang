const i18n = require('../lib/i18n.js')
const LOCALES = {
  en: {
    validation_failed: 'validation failed',
    required: 'is required',
    eq: 'must be equal to %s'
  }
}

describe('t', () => {
  it('should translate a string', async () => {
    const $t = i18n.t({ lang: 'en', locales: LOCALES })
    const result = $t('validation_failed')
    expect(result).toBe('validation failed')
  })

  it('should support merging of locales', async () => {
    const locales = {
      en: {
        'merged': 'merged'
      }
    }
    const $t = i18n.t({ lang: 'en', locales })
    const result = $t('merged')
    expect(result).toBe('merged')
  })

  it('should support interpolation', async () => {
    const locales = {
      en: {
        'interpolation': 'interpolation %s %d'
      }
    }
    const $t = i18n.t({ lang: 'en', locales })
    const result = $t('interpolation', 'hello', 5)
    expect(result).toBe('interpolation hello 5')
  })

  it('should not fail and return key if locale missing', async () => {
    const $t = i18n.t()
    const result = $t('non-existant %s', 5)
    expect(result).toBe('non-existant 5')
  })

  it('should not fail and return key if language missing', async () => {
    const $t = i18n.t({ lang: 'no' })
    const result = $t('non-existant')
    expect(result).toBe('non-existant')
  })

  it('should not fail and return correct locale', async () => {
    const locales = {
      en: {
        'greeting': 'hello'
      },
      es: {
        'greeting': 'hola'
      }
    }
    const $t = i18n.t({ lang: 'es', locales })
    const result = $t('greeting')
    expect(result).toBe('hola')
  })

  it('should format translations', async () => {
    const $t = i18n.t({ locales: LOCALES })
    const result = $t('eq', 'hello')
    expect(result).toBe('must be equal to hello')
  })
})

describe('link', () => {
  it('should return the correct link for index', async () => {
    const link = i18n.link()
    const result = link('index')
    expect(result).toBe('/')
  })

  it('should return the correct link for page', async () => {
    const link = i18n.link()
    const result = link('about')
    expect(result).toBe('/about.html')
  })

  it('should return the correct link for deep page', async () => {
    const link = i18n.link()
    const result = link('docs/about')
    expect(result).toBe('/docs/about.html')
  })

  it('should return the correct link for routemap string match', async () => {
    const routemap = {
      '/om-oss.html': 'about'
    }
    const link = i18n.link({ routemap })
    const result = link('about')
    expect(result).toBe('/om-oss.html')
  })

  it('should return the correct link for routemap object match', async () => {
    const routemap = {
      '/om-oss.html': { page: 'about' }
    }
    const link = i18n.link({ routemap })
    const result = link('about')
    expect(result).toBe('/om-oss.html')
  })

  it('should return the correct link for routemap', async () => {
    const routes = {}
    routes.routemap = {
      '/about.html': { page: 'about', lang: 'en' },
      '/om-oss.html': { page: 'about', lang: 'no' }
    }
    const link = i18n.link(routes)
    let result = link('about')
    expect(result).toBe('/about.html')

    result = link('about', { lang: 'en' })
    expect(result).toBe('/about.html')

    result = link('about', { lang: 'no' })
    expect(result).toBe('/om-oss.html')
  })

  it('should return the correct link for routemap index', async () => {
    const routes = {}
    routes.routemap = {
      '/': { page: 'index', lang: 'no' },
      '/en/': { page: 'index', lang: 'en' }
    }
    const link = i18n.link(routes)
    let result = link('index')
    expect(result).toBe('/')

    result = link('index', { lang: 'en' })
    expect(result).toBe('/en/')
  })

  it('should return the correct link with dynamic routes', async () => {
    const link = i18n.link()
    let result = link('about')
    expect(result).toBe('/about.html')
  })

  it('should return the correct link with dynamic deep routes', async () => {
    const link = i18n.link()
    let result = link('_month/_year/post')
    expect(result).toBe('/_month/_year/post.html')

    result = link('_month/_year/post', 12, 20)
    expect(result).toBe('/12/20/post.html')
  })
})