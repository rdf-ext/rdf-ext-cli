import rdf from 'rdf-ext'
import Client from 'sparql-http-client/StreamClient.js'

async function createInputStream ({ contentType, defaultStream, endpointUrl, query, url }) {
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

    return res.quadStream()
  }

  const parser = rdf.formats.parsers.get(contentType)

  return parser.import(defaultStream)
}

export default createInputStream
