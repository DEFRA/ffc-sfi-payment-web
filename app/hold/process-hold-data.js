const parsedSchema = require('../routes/schemas/parsed-hold')

const processHoldData = async (data) => {
  const uploadData = []
  const splitData = data.split(',')
  for (let i = 0; i < splitData.length; i++) {
    const result = parsedSchema.validate({ frn: splitData[i] }, {
      abortEarly: false
    })
    if (result.error) {
      return {
        errors: result.error
      }
    } else {
      uploadData.push(splitData[i])
    }
  }
  return {
    uploadData
  }
}

module.exports = {
  processHoldData
}
