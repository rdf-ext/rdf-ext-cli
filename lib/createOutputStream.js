import rdf from 'rdf-ext'
import { PassThrough } from 'readable-stream'

async function createOutputStream ({ contentType, prefixes }) {
  const output = new PassThrough({ objectMode: true })
  const serializer = rdf.formats.serializers.get(contentType)

  const stream = serializer.import(output, { prefixes })
  stream.pipe(process.stdout)

  return output
}

export default createOutputStream
