export function getConnInfo(conn) {
  if (!conn || typeof conn !== 'object') {
    return null
  }

  const { spacesEndpoint = {}, s3 = {} } = conn
  const { host } = spacesEndpoint
  const { config = {} } = s3
  const { accessKeyId, secretAccessKey } = config

  return {
    endpoint: host,
    accessKeyId,
    secretAccessKey,
  }
}
