import rdf from 'rdf-ext'
import { Transform } from 'readable-stream'

function transformToTriple () {
  return new Transform({
    objectMode: true,
    transform: (quad, encoding, callback) => {
      callback(null, rdf.quad(quad.subject, quad.predicate, quad.object))
    }
  })
}

export default transformToTriple
