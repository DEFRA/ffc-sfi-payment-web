const mockApplicationInsights = require('../mocks/objects/application-insights')

const insights = require('../../app/insights')

const applicationName = require('../mocks/components/application-name')

describe('App Insight setup', () => {
  beforeEach(() => {
    process.env.APPINSIGHTS_CLOUDROLE = applicationName
    process.env.APPINSIGHTS_CONNECTIONSTRING = 'something'
  })

  afterEach(() => {
    delete process.env.APPINSIGHTS_CONNECTIONSTRING
    jest.clearAllMocks()
  })

  describe('When process.env.APPINSIGHTS_CONNECTIONSTRING exists', () => {
    test('should call mockApplicationInsights.setup', () => {
      insights.setup()
      expect(mockApplicationInsights.setup).toHaveBeenCalled()
    })

    test('should call mockApplicationInsights.setup once', () => {
      insights.setup()
      expect(mockApplicationInsights.setup).toHaveBeenCalledTimes(1)
    })

    test('should call mockApplicationInsights.setup.start', () => {
      insights.setup()
      expect(mockApplicationInsights.setup().start).toHaveBeenCalled()
    })

    test('should call mockApplicationInsights.setup.start once', () => {
      insights.setup()
      expect(mockApplicationInsights.setup().start).toHaveBeenCalledTimes(1)
    })

    test('should have applicationName as value for mockApplicationInsights.defaultClient.context.tags[mockApplicationInsights.defaultClient.context.keys.cloudRole] key', () => {
      insights.setup()
      expect(mockApplicationInsights.defaultClient.context.tags[mockApplicationInsights.defaultClient.context.keys.cloudRole]).toEqual(applicationName)
    })
  })

  describe('When process.env.APPINSIGHTS_CONNECTIONSTRING does not exists', () => {
    beforeEach(() => {
      delete process.env.APPINSIGHTS_CONNECTIONSTRING
    })

    test('should not call mockApplicationInsights.setup', () => {
      insights.setup()
      expect(mockApplicationInsights.setup).not.toHaveBeenCalled()
    })

    test('should not call mockApplicationInsights.setup.start', () => {
      insights.setup()
      expect(mockApplicationInsights.setup().start).not.toHaveBeenCalled()
    })

    // test('should have undefined value for tags cloudRoleTag key', () => {
    //   insights.setup()
    //   expect(tags[cloudRoleTag]).toBeUndefined()
    // })
  })
})
