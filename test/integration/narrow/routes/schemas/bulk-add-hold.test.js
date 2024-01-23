const bulkSchema = require('../../../../../app/routes/schemas/bulk-add-hold')

describe('Bulk Hold Validator', () => {
  test('Valid File Object', () => {
    const validFile = {
      filename: 'example.csv',
      path: '/path/to/file',
      headers: {
        'content-disposition': 'attachment; filename="example.csv"',
        'content-type': 'text/csv'
      },
      bytes: 1024
    }
    expect(() => bulkSchema.validate({ holdCategoryId: 1, file: validFile })).not.toThrow()
  })

  test('Invalid - missing holdcategoryid', () => {
    const invalidFile = {
      filename: 'example.csv',
      path: '/path/to/file',
      headers: {
        'content-disposition': 'attachment; filename="example.csv"',
        'content-type': 'text/csv'
      },
      bytes: 1024
    }
    const validationResult = bulkSchema.validate({ file: invalidFile })
    expect(validationResult.error).toBeDefined()
    expect(validationResult.error.message).toMatch(/Category is required/)
  })

  test('Invalid File Object - Missing filename', () => {
    const invalidFile = {
      path: '/path/to/file',
      headers: {
        'content-disposition': 'attachment; filename="example.csv"',
        'content-type': 'text/csv'
      },
      bytes: 1024
    }
    const validationResult = bulkSchema.validate({ holdCategoryId: 1, file: invalidFile })
    expect(validationResult.error).toBeDefined()
    expect(validationResult.error.message).toMatch(/Provide a CSV file/)
  })

  test('Invalid File Object - Missing path', () => {
    const invalidFile = {
      filename: 'example.csv',
      headers: {
        'content-disposition': 'attachment; filename="example.csv"',
        'content-type': 'text/csv'
      },
      bytes: 1024
    }
    const validationResult = bulkSchema.validate({ holdCategoryId: 1, file: invalidFile })
    expect(validationResult.error).toBeDefined()
    expect(validationResult.error.message).toMatch(/Provide a CSV file/)
  })

  test('Invalid File Object - Missing headers', () => {
    const invalidFile = {
      filename: 'example.csv',
      path: '/path/to/file',
      bytes: 1024
    }
    const validationResult = bulkSchema.validate({ holdCategoryId: 1, file: invalidFile })
    expect(validationResult.error).toBeDefined()
    expect(validationResult.error.message).toMatch(/Provide a CSV file/)
  })

  test('Invalid File Object - Missing headers -> content-type', () => {
    const invalidFile = {
      filename: 'example.csv',
      path: '/path/to/file',
      headers: {
        'content-disposition': 'attachment; filename="example.csv"'
      },
      bytes: 1024
    }
    const validationResult = bulkSchema.validate({ holdCategoryId: 1, file: invalidFile })
    expect(validationResult.error).toBeDefined()
    expect(validationResult.error.message).toMatch(/Provide a CSV file/)
  })

  test('Invalid File Object - headers -> content-type not text/csv', () => {
    const invalidFile = {
      filename: 'example.csv',
      path: '/path/to/file',
      headers: {
        'content-disposition': 'attachment; filename="example.csv"',
        'content-type': 'not-text-csv'
      },
      bytes: 1024
    }
    const validationResult = bulkSchema.validate({ holdCategoryId: 1, file: invalidFile })
    expect(validationResult.error).toBeDefined()
    expect(validationResult.error.message).toMatch(/Provide a CSV file/)
  })

  test('Invalid File Object - Missing headers -> content-disposition', () => {
    const invalidFile = {
      filename: 'example.csv',
      path: '/path/to/file',
      headers: {
        'content-type': 'text/csv'
      },
      bytes: 1024
    }
    const validationResult = bulkSchema.validate({ holdCategoryId: 1, file: invalidFile })
    expect(validationResult.error).toBeDefined()
    expect(validationResult.error.message).toMatch(/Provide a CSV file/)
  })

  test('Invalid File Object - Missing bytes', () => {
    const invalidFile = {
      filename: 'example.csv',
      path: '/path/to/file',
      headers: {
        'content-disposition': 'attachment; filename="example.csv"',
        'content-type': 'text/csv'
      }
    }
    const validationResult = bulkSchema.validate({ holdCategoryId: 1, file: invalidFile })
    expect(validationResult.error).toBeDefined()
    expect(validationResult.error.message).toMatch(/Provide a CSV file/)
  })
})
