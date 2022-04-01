const { DefaultAzureCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')
const config = require('./config/blob-storage')
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

const eventProjectionContainer = blobServiceClient.getContainerClient(config.eventProjectionContainer)

async function initialiseContainers () {
  if (config.createContainers) {
    console.log('Making sure blob containers exist')
    await eventProjectionContainer.createIfNotExists()
  }
  containersInitialised = true
}

async function getBlob (container, folder, filename) {
  containersInitialised ?? await initialiseContainers()
  return container.getBlockBlobClient(`${folder}/${filename}`)
}

async function getFileList (container, prefix) {
  containersInitialised ?? await initialiseContainers()
  const fileList = []
  for await (const file of container.listBlobsFlat({ prefix })) {
    if (file.name.endsWith('.dat') || file.name.endsWith('.csv')) {
      fileList.push(file.name.replace(`${prefix}/`, ''))
    }
  }
  return { containerName: container._containerName, prefix, fileList }
}

async function getFileDetails (containerName, prefix, filename) {
  const container = getContainer(containerName)
  const blob = await getBlob(container, prefix, filename)
  return blob.getProperties()
}

const getContainer = (containerName) => {
  if (containerName === config.eventProjectionContainer) {
    return eventProjectionContainer
  }

  return null
}

async function downloadPaymentFile (constainerName, prefix, filename) {
  const container = getContainer(constainerName)
  const blob = await getBlob(container, prefix, filename)
  const blobBuffer = await blob.downloadToBuffer()
  return blobBuffer.toString('utf-8')
}

module.exports = {
  downloadPaymentFile,
  getFileDetails,
  getFileList,
  blobServiceClient
}
