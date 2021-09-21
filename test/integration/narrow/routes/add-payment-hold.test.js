const { getResponse, postRequest } = require('../../../../app/payment-holds')
const wreck = require('@hapi/wreck')
describe('application task list route', () => {
  jest.mock('../../../../app/payment-holds')
  jest.mock('../../../../app/api')

  let createServer
  let server

  beforeEach(async () => {
    wreck.get = jest.fn()
    createServer = require('../../../../app/server')
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('GET /add-payment-hold returns 200', async () => {
    const wreckResponse = {
      payload: null,
      res: {
        statusCode: 200
      }
    }

    wreck.get.mockReturnValue(wreckResponse)

    jest.mock('@hapi/wreck')
    jest.mock(
      'getResponse',
      () => {
        return jest.fn(() => {})
      }
    )
    const options = {
      method: 'GET',
      url: '/add-payment-hold'
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  // test('GET /add-payment-hold returns application-task-list view', async () => {
  //   const options = {
  //     method: 'GET',
  //     url: '/add-payment-hold'
  //   }

  //   const result = await server.inject(options)
  //   expect(result.request.response.variety).toBe('view')
  //   expect(result.request.response.source.template).toBe('application-task-list')
  // })
})

// const schema = require('./schemas/frn')
// const { getResponse, postRequest } = require('../payment-holds')

// module.exports = [{
//   method: 'GET',
//   path: '/add-payment-hold',
//   options: {
//     handler: async (request, h) => {
//       const paymentHoldCategoriesResponse = await getResponse('/payment-hold-categories')
//       return h.view('add-payment-hold', { paymentHoldCategories: paymentHoldCategoriesResponse.payload.paymentHoldCategories })
//     }
//   }
// },
// {
//   method: 'POST',
//   path: '/add-payment-hold',
//   options: {
//     validate: {
//       payload: schema,
//       failAction: async (request, h, error) => {
//         const paymentHoldCategoriesResponse = await getResponse('/payment-hold-categories')
//         return h.view('add-payment-hold', { paymentHoldCategories: paymentHoldCategoriesResponse.payload.paymentHoldCategories, errors: error }).code(400).takeover()
//       }
//     },
//     handler: async (request, h) => {
//       await postRequest('/add-payment-hold', { holdCategoryId: request.payload.holdCategory, frn: request.payload.frn }, null)
//       return h.redirect('/')
//     }
//   }
// }]
