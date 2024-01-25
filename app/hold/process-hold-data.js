const parsedSchema = require('../routes/schemas/parsed-hold')

const processHoldData = async (data) => {
  const uploadData = []
  const splitData = data.split(',')
  for (const data of splitData) {
    const result = parsedSchema.validate({ frn: data }, {
      abortEarly: false
    })
    if (result.error) {
      return {
        errors: result.error
      }
    } else {
      uploadData.push(data)
    }
  }
  return {
    uploadData
  }
}

module.exports = {
  processHoldData
}
