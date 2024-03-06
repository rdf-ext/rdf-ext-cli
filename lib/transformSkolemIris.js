import { randomUUID } from 'node:crypto'
import rdf from 'rdf-ext'
import { Transform } from 'readable-stream'

function transformSkolemIris (baseIri) {
  const nodeMap = rdf.termMap()

  const mapTerm = term => {
    if (term.termType === 'BlankNode') {
      if (!nodeMap.has(term)) {
        nodeMap.set(term, rdf.namedNode(`${baseIri}${randomUUID().split('-').join('')}`))
      }

      return nodeMap.get(term)
    }

    return term
  }

  const mapQuad = quad => {
    return rdf.quad(
      mapTerm(quad.subject),
      mapTerm(quad.predicate),
      mapTerm(quad.object),
      mapTerm(quad.graph)
    )
  }

  return new Transform({
    objectMode: true,
    transform: (quad, encoding, callback) => {
      callback(null, mapQuad(quad))
    }
  })
}

export default transformSkolemIris
