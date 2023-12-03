import duplexify from 'duplexify'
import rdf from 'rdf-ext'
import { PassThrough } from 'readable-stream'
import { Validator } from 'shacl-engine'

function createShaclStream (shapeStream, { debug, details, trace } = {}) {
  const input = new PassThrough({ objectMode: true })
  const output = new PassThrough({ objectMode: true })

  queueMicrotask(async () => {
    const shape = await rdf.dataset().import(shapeStream)
    const engine = new Validator(shape, { debug, details, factory: rdf, trace })
    const dataset = await rdf.dataset().import(input)
    const report = await engine.validate({ dataset })

    report.dataset.toStream().pipe(output)
  })

  return duplexify.obj(input, output)
}

export default createShaclStream
