const cheerio = require('cheerio')
const createServer = require('../../../../app/server')

describe('Cookies', () => {
  let server
  const url = '/cookies'
  const pageH1 = 'Cookies'

  beforeEach(async () => {
    jest.clearAllMocks()
    server = await createServer()
  })

  afterEach(async () => {
    await server.stop()
  })

  describe('GET requests', () => {
    const method = 'GET'

    test('returns 200 with cookie policy', async () => {
      const res = await server.inject({ method, url })

      expect(res.statusCode).toBe(200)
      const $ = cheerio.load(res.payload)
      expect($('h1').text()).toEqual(pageH1)
    })

    test.each([
      { acceptAnalCookies: true },
      { acceptAnalCookies: false }
    ])('returns 200 with correct analytics radio selected - %s', async ({ acceptAnalCookies }) => {
      const cookiePolicyCookie = Buffer.from(JSON.stringify({ analytics: acceptAnalCookies })).toString('base64')

      const res = await server.inject({ method, url, headers: { cookie: `cookies_policy=${cookiePolicyCookie}` } })

      expect(res.statusCode).toBe(200)
      const $ = cheerio.load(res.payload)
      expect($('h1').text()).toEqual(pageH1)
      expect($('#analytics').attr('checked')).toBe(acceptAnalCookies ? 'checked' : undefined)
      expect($('#analytics-2').attr('checked')).toEqual(acceptAnalCookies ? undefined : 'checked')
    })

    test.each([
      { updatedValue: '%20', bannerShouldBeDisplayed: true },
      { updatedValue: 'true', bannerShouldBeDisplayed: true },
      { updatedValue: 'false', bannerShouldBeDisplayed: true },
      { updatedValue: '0', bannerShouldBeDisplayed: true },
      { updatedValue: '', bannerShouldBeDisplayed: false }
    ])('returns 200 with updated message when URL contains updated parameter set to a value', async ({ updatedValue, bannerShouldBeDisplayed }) => {
      const urlWithUpdated = `${url}?updated=${updatedValue}`

      const res = await server.inject({ method, url: urlWithUpdated })

      expect(res.statusCode).toBe(200)
      const $ = cheerio.load(res.payload)
      expect($('.govuk-notification-banner__heading').length).toEqual(bannerShouldBeDisplayed ? 1 : 0)
    })
  })

  function getCookiePolicy (res) {
    const cookies = res.headers['set-cookie']
    const cookiePolicyCookie = cookies.find(cookie => {
      return cookie.split('=')[0] === 'cookies_policy'
    })

    const cookiePolicy = cookiePolicyCookie.match(/cookies_policy=([^",;\\\x7F]*)/)[1]
    return JSON.parse(Buffer.from(cookiePolicy, 'base64').toString())
  }

  describe('POST requests', () => {
    const method = 'POST'

    test.each([
      { analytics: true },
      { analytics: false }
    ])('returns 302 to cookie policy route along with the cookie policy', async ({ analytics }) => {
      const res = await server.inject({ method, url, payload: { analytics } })

      expect(res.statusCode).toBe(302)
      expect(res.headers.location).toEqual(`${url}?updated=true`)
      const cookiePolicyValue = getCookiePolicy(res)
      expect(cookiePolicyValue).toEqual({ confirmed: true, essential: true, analytics })
    })

    test.each([
      { analytics: true },
      { analytics: false }
    ])('returns 200 when request is async along with the cookie policy', async ({ analytics }) => {
      const res = await server.inject({ method, url, payload: { analytics, async: true } })

      expect(res.statusCode).toBe(200)
      expect(res.payload).toEqual('ok')
      const cookiePolicyValue = getCookiePolicy(res)
      expect(cookiePolicyValue).toEqual({ confirmed: true, essential: true, analytics })
    })
  })
})
