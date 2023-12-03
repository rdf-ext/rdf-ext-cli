import rdf from 'rdf-ext'
import { mapStream } from 'rdf-utils-namespace/map.js'

function transformMapNamespace (mapping) {
  return mapStream(mapping, { factory: rdf })
}

export default transformMapNamespace
