const { DefaultAzureCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')
const parseJsonDate = require('./parse-json-date')
const config = require('./config').storageConfig
let blobServiceClient
let containersInitialised

if (config.useConnectionStr) {
  console.log('Using connection string for BlobServiceClient')
  blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionStr)
} else {
  console.log('Using DefaultAzureCredential for BlobServiceClient')
  const uri = `https://${config.storageAccount}.blob.core.windows.net`
  blobServiceClient = new BlobServiceClient(uri, new DefaultAzureCredential())
}

const container = blobServiceClient.getContainerClient(config.container)

const initialiseContainers = async () => {
  if (config.createContainers) {
    console.log('Making sure blob containers exist')
    await container.createIfNotExists()
  }
  containersInitialised = true
}

const getBlobList = async (prefix) => {
  console.log(`Getting blob list for prefix ${prefix}`)
  !containersInitialised && await initialiseContainers()
  const eventBlobList = {
    prefix,
    blobList: []
  }

  const blobList = await container.listBlobsFlat({ prefix: prefix.toString() })

  for await (const blob of blobList) {
    const split = blob.name.split('/')
    const data = {
      frn: split[0],
      agreementNumber: split[1],
      requestNumber: split[2],
      fileName: split[3],
      blob: blob.name,
      updatedDate: parseJsonDate(blob.properties.lastModified, false)
    }

    eventBlobList.blobList.push(data)
  }

  return eventBlobList
}

const getBlob = async (blobPath) => {
  containersInitialised ?? await initialiseContainers()
  return container.getBlockBlobClient(blobPath)
}

async function getProjection (blobPath) {
  const blob = await getBlob(blobPath)
  const blobBuffer = await blob.downloadToBuffer()
  return JSON.parse(blobBuffer.toString('utf-8'))
}

module.exports = {
  blobServiceClient,
  getProjection,
  getBlobList
}
