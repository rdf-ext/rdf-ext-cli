import rdf from 'rdf-ext'
import Client from 'sparql-http-client/StreamClient.js'

async function createInputStream ({
  contentType,
  defaultStream,
  endpointUrl,
  prefix = () => {},
  query,
  url
}) {
  if (endpointUrl) {
    if (!query) {
      query = `DESCRIBE <${url}>`
    }

    const client = new Client({ endpointUrl })

    return client.query.construct(query)
  }

  if (url !== '-') {
    const res = await rdf.fetch(url)

    if (contentType) {
      res.headers.set('content-type', contentType)
    }

    const stream = await res.quadStream()

    stream.on('prefix', (...args) => prefix(...args))

    return stream
  }

  const parser = rdf.formats.parsers.get(contentType)
  const stream = parser.import(defaultStream)

  stream.on('prefix', (...args) => prefix(...args))

  return stream
}

export default createInputStream
